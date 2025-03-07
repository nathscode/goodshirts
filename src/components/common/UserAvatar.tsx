import React from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";

type Props = {
	name?: string;
	image?: string;
};

const UserAvatar = ({ name, image }: Props) => {
	return (
		<Avatar>
			<AvatarImage src={image} />
			<AvatarFallback className="bg-white text-xs">
				<span className="font-bold">{name}</span>
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
