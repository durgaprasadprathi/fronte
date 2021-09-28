import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";

//components
import StatusArea from "../../diagram/statusArea";
import { updateCanvasJson } from "../../../pages/diagram/actions";
import { capitalizeAttribute } from "../../../shared/stringManipulation"


//CSS
import "./styles.css";


const RightSideModal = (props: any) => {

    const [state, setState] = useState<any>({})

    useEffect(() => {
        if (props.diagram.rightBarProperty) {
            setState(props.diagram.rightBarProperty.properties)
        }
    }, [props.diagram.rightBarProperty])

    const handleChange = (e: any, name: string) => {
        let _state = {...state};
        _state[name] = e.target.value;
        setState(_state);
    }

    const handleSubmit = (e:any) =>{
        e.preventDefault();
        console.log(props.diagram.rightBarProperty.key, props.diagram.canvasProperties)
        let _canvasProperties = [...props.diagram.canvasProperties]
        console.log(_canvasProperties)
        let filter = _canvasProperties.findIndex((c:any) => c.key === props.diagram.rightBarProperty.key);
        console.log(filter)
        if(filter >= 0){
            _canvasProperties[filter] = {
                ...props.diagram.rightBarProperty,
                properties:state
            }
        }
        else{
            _canvasProperties.push({
                ...props.diagram.rightBarProperty,
                properties:state
            })
        }

        console.log(_canvasProperties)

        props.updateCanvasJson(_canvasProperties)
    }
    console.log(state)

    return (
        <div className="right-sidebar-modal">
            {
                props.diagram && props.diagram.rightBarProperty && Object.keys(props.diagram.rightBarProperty).length > 0
                    ?
                    <div className="diagram-sidebar-top-section">
                        <div className="right-sidebar-title">
                            {props.diagram.rightBarProperty.name}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="right-sidebar-display">

                                {
                                    props.diagram.rightBarProperty && props.diagram.rightBarProperty.properties && Object.keys(props.diagram.rightBarProperty.properties).map((p: any) => (
                                        <>
                                            <div className="row mt-1">
                                                <div className="col-md-12">
                                                    <label style={{margin: 0, fontWeight:700}}>{capitalizeAttribute(p)}</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={p}
                                                        value={state ? state[p]: ''}
                                                        onChange={(e) => handleChange(e, p)}
                                                    />
                                                </div>
                                            </div>

                                        </>

                                    ))
                                }
                                <div className="row mt-2">
                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    : <div className="diagram-sidebar-top-section"></div>

            }

            <div className="diagram-sidebar-bottom-section">
                <StatusArea
                    message={props.diagram.message}
                />
            </div>
        </div>
    )
}


const mapStateToProps = (state: any) => {
    return {
        diagram: state.Diagram,
    };
};

const mapDispatchToProps = { updateCanvasJson }

export default connect(mapStateToProps, mapDispatchToProps)(RightSideModal);
