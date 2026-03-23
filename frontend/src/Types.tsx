import { Dispatch, SetStateAction } from "react";

export type UserDataBasic = {
	id: number,
	surname: string,
	name: string,
	dateOfBirth: string,
	gender: "male" | "female" | "other",
	couple: number[],
	parent1: number,
	parent2: number,
	prime: true | false,
	picture: string
}

export type WorkflowProps = {
	dataBasicMembers: UserDataBasic[];
	functionClose: Dispatch<SetStateAction<boolean>>
	memberSelect: Dispatch<SetStateAction<number>>
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
  position: 'right' | 'left',
  duplicatedPartnerId?: number;
  leftPartners?: UnionNode[];
};

export type MediaInfos = {
	id: number,
	name: string,
	url: string,
	extension: String,
	type: "audio" | "video" | "picture" | "text",
	membersId: number[]
}