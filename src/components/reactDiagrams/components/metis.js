import MetisMenu from 'react-metismenu';
import "react-metismenu/dist/react-metismenu-standart.min.css";
const content = [
	{
		icon: 'icon-class-name',
		label: 'Application',
		content: [
			{
				icon: 'icon-class-name',
				label: 'VPC',
			},
			{
				icon: 'icon-class-name',
				label: 'Subnet',
			},
		],
	},
	{
		icon: 'icon-class-name',
		label: 'Application2',
		content: [
			{
				icon: 'icon-class-name',
				label: 'VPC',
			},
			{
				icon: 'icon-class-name',
				label: 'Subnet',
			},
		],
	},
	{
		icon: 'icon-class-name',
		label: 'Application3',
		content: [
			{
				icon: 'icon-class-name',
				label: 'VPC',
			},
			{
				icon: 'icon-class-name',
				label: 'Subnet',
			},
		],
	},
];

const Metis = () =>{
    return (
        <MetisMenu content={content} activeLinkFromLocation />
    )
}

export default Metis;