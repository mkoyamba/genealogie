export type UserDataBasic = {
	id: number,
	surname: string,
	name: string,
	dateOfBirth: string,
	gender: "male" | "female" | "other",
	couple: number[],
	parent1: number,
	parent2: number,
	prime: true | false
}

export type WorkflowProps = {
	dataBasicMembers: UserDataBasic[];
};

export type memberChildsTemplate = {
	id: number,
	data: UserDataBasic,
	children: memberChildsTemplate[],
	couple: number[]
};

export type UnionNode = {
  key: string;
  partners: UserDataBasic[];
  children: UnionNode[];
};