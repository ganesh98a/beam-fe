import React from "react";
import { connect } from "react-redux";
import Form from "@rjsf/core";

class SchemaFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.transformErrors = this.transformErrors.bind(this);

    };
    componentDidMount() {
        console.log('SchemaFormComponent-props', this.props)
    }
    transformErrors(errors) {
        console.log('transformErrors', errors)
        var schema = this.props.modelData;
        return errors.map(error => {
            var propertyName = error.property.replace('.', '')
            // use error messages from JSON schema if any
            if (schema.properties[propertyName].messages && schema.properties[propertyName].messages[error.name]) {
                console.log('message', schema.properties[propertyName].messages[error.name])
                return {
                    ...error,
                    message: schema.properties[propertyName].messages[error.name]
                };
            }
            return error;
        });
    }
    render() {

        return (
            <div>
                <Form schema={this.props.schema}
                    onChange={this.props.onChange("changed")}
                    onSubmit={this.props.onSubmit}
                    onError={this.props.onError("errors")}
                    noHtml5Validate='true'
                    transformErrors={this.transformErrors}
                    showErrorList={false}
                    uiSchema={this.props.uiSchema}
                    FieldTemplate={this.props.customFieldTemplate}
                    widgets={this.props.widgets}
                    formData={this.props.formData}
                    omitExtraData={true}
                    liveOmit={true}
                >
                    <div className="w-100 m-t-20 float-left text-center pointer">
                        <button type="submit" className="btn btn-beam-blue">
                            Add Activity
                                            </button>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth
    };
};

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SchemaFormComponent);