import type { UserDataBasic, UnionNode } from "../../Types";

// clé stable "U:12-34"
const unionKey = (a: number, b: number) => {
  const [x, y] = a < b ? [a, b] : [b, a];
  return `U:${x}-${y}`;
};

// convertit string[] | number[] -> number[]
const toNumberIds = (arr: unknown): number[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((v) => (typeof v === "string" ? Number(v) : v))
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n) && n !== 0);
};

const dedupeByKey = (arr: UnionNode[]) => {
  const seen = new Set<string>();
  return arr.filter((node) => {
    if (seen.has(node.key)) return false;
    seen.add(node.key);
    return true;
  });
};

const hasKnownParent = (
  value: unknown,
  byId: Map<number, UserDataBasic>
): value is number => {
  return typeof value === "number" && value !== 0 && byId.has(value);
};

export function buildUnionTree(members: UserDataBasic[]): UnionNode[] {
  const byId = new Map<number, UserDataBasic>();
  for (const member of members) {
    byId.set(member.id, member);
  }

  // enfants regroupés par union parentale
  const childrenByUnion = new Map<string, UserDataBasic[]>();

  for (const child of members) {
    const p1 = child.parent1;
    const p2 = child.parent2;

    if (hasKnownParent(p1, byId) && hasKnownParent(p2, byId)) {
      const key = unionKey(p1, p2);
      const existing = childrenByUnion.get(key) ?? [];
      existing.push(child);
      childrenByUnion.set(key, existing);
    }
  }

  const buildSingle = (id: number, visited: Set<string>): UnionNode | null => {
    const person = byId.get(id);
    if (!person) return null;

    const key = `S:${id}`;
    if (visited.has(key)) return null;

    const nextVisited = new Set(visited);
    nextVisited.add(key);

    return {
      key,
      partners: [person],
      children: buildDescendantNodesForPerson(id, nextVisited),
      position: 'right'
    };
  };

  const buildUnion = (
    a: number,
    b: number,
    visited: Set<string>
  ): UnionNode | null => {
    const partnerA = byId.get(a);
    const partnerB = byId.get(b);

    if (!partnerA || !partnerB) return null;

    const key = unionKey(a, b);
    if (visited.has(key)) return null;

    const nextVisited = new Set(visited);
    nextVisited.add(key);

    const childrenPersons = childrenByUnion.get(key) ?? [];
    const childNodes: UnionNode[] = [];

    for (const child of childrenPersons) {
      const childPartners = toNumberIds(child.couple).filter(
        (pid) => pid !== child.id && byId.has(pid)
      );

      if (childPartners.length === 0) {
        const singleNode = buildSingle(child.id, nextVisited);
        if (singleNode) childNodes.push(singleNode);
        continue;
      }

      for (const pid of childPartners) {
        const unionNode = buildUnion(child.id, pid, nextVisited);
        if (unionNode) childNodes.push(unionNode);
      }
    }

    return {
      key,
      partners: [partnerA, partnerB],
      children: dedupeByKey(childNodes),
      position: 'right'
    };
  };

  const buildDescendantNodesForPerson = (
    id: number,
    visited: Set<string>
  ): UnionNode[] => {
    const person = byId.get(id);
    if (!person) return [];

    const partners = toNumberIds(person.couple).filter(
      (pid) => pid !== id && byId.has(pid)
    );

    const result: UnionNode[] = [];

    for (const pid of partners) {
      const unionNode = buildUnion(id, pid, visited);
      if (unionNode) result.push(unionNode);
    }

    return dedupeByKey(result);
  };

  // Une union racine = couple dont le membre courant n'a pas deux parents connus.
  // Cela permet d'avoir Papi+Mamie comme root, puis Alain+Samira en enfant.
  const rootNodes: UnionNode[] = [];
  const rootUnionKeys = new Set<string>();

  for (const member of members) {
    const partners = toNumberIds(member.couple).filter(
      (pid) => pid !== member.id && byId.has(pid)
    );

    const memberHasTwoKnownParents =
      hasKnownParent(member.parent1, byId) && hasKnownParent(member.parent2, byId);

    for (const pid of partners) {
      const key = unionKey(member.id, pid);
      if (rootUnionKeys.has(key)) continue;

      if (!memberHasTwoKnownParents) {
        const unionNode = buildUnion(member.id, pid, new Set());
        if (unionNode) {
          rootNodes.push(unionNode);
          rootUnionKeys.add(key);
        }
      }
    }
  }

  // Singles racines : personnes sans partenaire et sans deux parents connus
  for (const member of members) {
    const partners = toNumberIds(member.couple).filter(
      (pid) => pid !== member.id && byId.has(pid)
    );

    const memberHasTwoKnownParents =
      hasKnownParent(member.parent1, byId) && hasKnownParent(member.parent2, byId);

    if (partners.length === 0 && !memberHasTwoKnownParents) {
      const singleNode = buildSingle(member.id, new Set());
      if (singleNode) rootNodes.push(singleNode);
    }
  }

  const uniqueRoots = dedupeByKey(rootNodes);

  // Supprime des roots les unions déjà présentes comme descendants
  const descendantKeys = new Set<string>();

  const collectDescendantKeys = (node: UnionNode) => {
    for (const child of node.children) {
      descendantKeys.add(child.key);
      collectDescendantKeys(child);
    }
  };

  for (const root of uniqueRoots) {
    collectDescendantKeys(root);
  }


  let allRoots = uniqueRoots.filter((root) => !descendantKeys.has(root.key));

  function parseUnionKey(key: string): [number, number] | null {
    if (!key.startsWith("U:")) return null;

    const [a, b] = key.slice(2).split("-").map(Number);

    if (Number.isNaN(a) || Number.isNaN(b)) return null;

    return [a, b];
  }

  let inUnion : number[] = []
  allRoots.forEach((root) => {
    if (root.key.startsWith('U')) {
      const ids = parseUnionKey(root.key)
      if (ids && ids[0]) {inUnion.push(ids[0])}
      if (ids && ids[1]) {inUnion.push(ids[1])}
    }
  })

  const soloInUnion =  Array.from(new Set(inUnion));

  const filteredRoots = allRoots.filter((root) => {
    if (root.key.startsWith("S") && soloInUnion.includes(root.partners[0].id)) {
      return false;
    }
    return true;
  })

  function attachNodesToParentUnion(
    roots: UnionNode[],
    byId: Map<number, UserDataBasic>
  ): UnionNode[] {
    const allNodes: UnionNode[] = [];
    const nodeByKey = new Map<string, UnionNode>();

    const visit = (node: UnionNode) => {
      allNodes.push(node);
      nodeByKey.set(node.key, node);

      node.children.forEach(visit);
    };

    roots.forEach(visit);

    const keysToRemoveFromRoots = new Set<string>();

    allNodes.forEach((node) => {
      // on cherche dans les partners une personne qui a deux parents connus
      let parentUnionKey: string | null = null;

      for (const partner of node.partners) {
        const p1 = partner.parent1;
        const p2 = partner.parent2;
        
        const hasP1 = typeof p1 === "number" && p1 !== undefined && byId.has(p1);
        const hasP2 = typeof p2 === "number" && p2 !== undefined && byId.has(p2);
        
        if (hasP1 && hasP2) {
          parentUnionKey = unionKey(p1, p2);
          break;
        }
      }

      if (!parentUnionKey) return;


      const parentUnionNode = nodeByKey.get(parentUnionKey);
      if (!parentUnionNode) return;

      // éviter de se rattacher à soi-même
      if (parentUnionNode.key === node.key) return;

      // éviter le doublon
      const alreadyChild = parentUnionNode.children.some(
        (child) => child.key === node.key
      );

      if (!alreadyChild) {
        parentUnionNode.children.push(node);
        parentUnionNode.children = dedupeByKey(parentUnionNode.children);
      }

      keysToRemoveFromRoots.add(node.key);
    });

    return roots.filter((root) => !keysToRemoveFromRoots.has(root.key));
  }

  const withDuplicates = attachNodesToParentUnion(filteredRoots, byId)

  function applyLeftPositionForDuplicatePeopleAtAllLevels(nodes: UnionNode[]): UnionNode[] {
    const processLevel = (levelNodes: UnionNode[]): UnionNode[] => {
      const seenByPersonId = new Set<number>();

      return levelNodes.map((node) => {
        let shouldGoLeft = false;

        for (const partner of node.partners) {
          if (seenByPersonId.has(partner.id)) {
            shouldGoLeft = true;
            node.duplicatedPartnerId = partner.id
          }
          else
            seenByPersonId.add(partner.id)
        }

        return {
          ...node,
          position: shouldGoLeft ? "left" : "right",
          children: processLevel(node.children),
        };
      });
    };

    return processLevel(nodes);
  }

  function mergeSharedPersonUnionsAtAllLevels(nodes: UnionNode[]): UnionNode[] {
    const processLevel = (levelNodes: UnionNode[]): UnionNode[] => {
      const merged: UnionNode[] = [];
      const ownerByPersonId = new Map<number, UnionNode>();

      for (const rawNode of levelNodes) {
        const node: UnionNode = {
          ...rawNode,
          children: processLevel(rawNode.children),
          leftPartners: rawNode.leftPartners ? [...rawNode.leftPartners] : [],
        };

        let attachedOwner: UnionNode | null = null;

        for (const partner of node.partners) {
          const owner = ownerByPersonId.get(partner.id);
          if (owner) {
            attachedOwner = owner;
            break;
          }
        }

        if (attachedOwner) {
          attachedOwner.leftPartners = attachedOwner.leftPartners ?? [];
          attachedOwner.leftPartners.push(node);
        } else {
          merged.push(node);
          node.partners.forEach((partner) => {
            ownerByPersonId.set(partner.id, node);
          });
        }
      }

      return merged;
    };

    return processLevel(nodes);
  }

  const removeDupes = applyLeftPositionForDuplicatePeopleAtAllLevels(withDuplicates)

  const result = mergeSharedPersonUnionsAtAllLevels(removeDupes)

  return result
}