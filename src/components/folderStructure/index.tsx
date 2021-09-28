import React from 'react';
import Tree from '@naisutech/react-tree';

const myThemes = {
    modifiedDarkLarge: {
      text: '#fafafa', // text color
      bg: '#2d3439', // background color of whole tree
      indicator: 'gold', // open folder indicator color
      separator: 'gold', // row seperator color
      icon: 'gold', // fill & stroke color of default icons - has no effect when using custom icons
      selectedBg: '#3f464e', // background of selected element
      selectedText: '#fafafa', // text color of selected element
      hoverBg: '#505a63', // background of hovered element
      hoverText: '#fafafa', // text color of hovered element
      accentBg: '#2d3439', // background of empty folder element
      accentText: '#999', // text color of empty folder element
      textSize: 'large' // preferred text size
    }
  }

class FolderStructure extends React.Component<any, {}> {
    constructor(props: any) {
        super(props);
        this.state = {

        }
    }

    onTreeStateChange = (state: any, event: any) => {
        // console.log(state, event);
    }

    handleSelectedMenu = (select:any) =>{
        // console.log(select)
        this.props.getSelectedFile(select)
    }

    render() {
        return (
            <div className="folder">
                <Tree 
                    nodes={this.props.data} 
                    containerStyle={{ height: "90vh", fontSize: "10px"}} 
                    onSelect={this.handleSelectedMenu}
                />
            </div>

        );
    }
}

export default FolderStructure;