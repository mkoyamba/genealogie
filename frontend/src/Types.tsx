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

export type MemberChildsTemplate = {
	id: number,
	data: UserDataBasic,
	children: MemberChildsTemplate[],
	couple: number[]
};

export type UnionNode = {
  key: string;
  partners: UserDataBasic[];
  children: UnionNode[];
};

export type MediaInfos = {
	id: number,
	name: string,
	url: String,
	extension: String,
	type: "audio" | "video" | "picture" | "text",
	membersId: number[]
}