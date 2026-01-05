import type { UserDataBasic, UnionNode } from "../../Types";

// clé stable "U:12-34"
const unionKey = (a: number, b: number) => {
  const [x, y] = a < b ? [a, b] : [b, a];
  return `U:${x}-${y}`;
};

// convertit couple: string[] | number[] -> number[]
const toNumberIds = (arr: unknown): number[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((v) => (typeof v === "string" ? Number(v) : v))
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n));
};

const dedupeByKey = (arr: UnionNode[]) => {
  const seen = new Set<string>();
  return arr.filter((n) => (seen.has(n.key) ? false : (seen.add(n.key), true)));
};

export function buildUnionTree(members: UserDataBasic[]): UnionNode[] {
  const byId = new Map<number, UserDataBasic>();
  for (const m of members) byId.set(m.id, m);

  // 1) enfants par union parentale (p1+p2) => l’enfant apparait UNE seule fois
  const childrenByUnion = new Map<string, UserDataBasic[]>();

  for (const child of members) {
    const p1 = child.parent1;
    const p2 = child.parent2;

    // ici on considère 0 comme "inconnu"
    const validP1 = typeof p1 === "number" && p1 !== null && byId.has(p1);
    const validP2 = typeof p2 === "number" && p2 !== null && byId.has(p2);

    if (validP1 && validP2) {
      const k = unionKey(p1, p2);
      if (!childrenByUnion.has(k)) childrenByUnion.set(k, []);
      childrenByUnion.get(k)!.push(child);
    }
  }

  // 2) construire une union (a,b) récursivement
  const buildUnion = (a: number, b: number, visited: Set<string>): UnionNode | null => {
    if (!byId.has(a) || !byId.has(b)) return null;

    const key = unionKey(a, b);
    if (visited.has(key)) return null; // évite cycles/répétitions
    visited.add(key);

    const pa = byId.get(a)!;
    const pb = byId.get(b)!;

    const childrenPersons = childrenByUnion.get(key) ?? [];

    const childrenUnions: UnionNode[] = [];
    for (const child of childrenPersons) {
      const partners = toNumberIds(child.couple)
        .filter((pid) => pid !== child.id && byId.has(pid));

      // si l'enfant n'a pas de partenaire, on l'affiche en "single" (S:id)
      if (partners.length === 0) {
        childrenUnions.push({
          key: `S:${child.id}`,
          partners: [child],
          children: buildSinglesChildren(child.id, visited),
        });
      } else {
        // plusieurs mariages => plusieurs unions sous cet enfant
        for (const pid of partners) {
          const u = buildUnion(child.id, pid, visited);
          if (u) childrenUnions.push(u);
        }
      }
    }

    return {
      key,
      partners: [pa, pb],
      children: dedupeByKey(childrenUnions),
    };
  };

  // 3) pour un "single", ses enfants = ses unions (mariages)
  const buildSinglesChildren = (id: number, visited: Set<string>): UnionNode[] => {
    const me = byId.get(id);
    if (!me) return [];

    const partners = toNumberIds(me.couple)
      .filter((pid) => pid !== id && byId.has(pid));

    const out: UnionNode[] = [];
    for (const pid of partners) {
      const u = buildUnion(id, pid, visited);
      if (u) out.push(u);
    }
    return dedupeByKey(out);
  };

  // 4) roots : à partir des primes
  const primes = members.filter((m) => m.prime);
  const roots: UnionNode[] = [];

  for (const p of primes) {
    const partners = toNumberIds(p.couple)
      .filter((pid) => pid !== p.id && byId.has(pid));

    const visited = new Set<string>();

    if (partners.length === 0) {
      roots.push({
        key: `S:${p.id}`,
        partners: [p],
        children: buildSinglesChildren(p.id, visited),
      });
    } else {
      for (const pid of partners) {
        const u = buildUnion(p.id, pid, visited);
        if (u) roots.push(u);
      }
    }
  }

  return dedupeByKey(roots);
}