import React from "react";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';

const MultiSelectComponent = props => {
    if (props.allowSelectAll && props.creatable) {
        return (
            <CreatableSelect
                {...props}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize' }) }}
                menuPortalTarget={document.querySelector('modal-dialog')}
                className={props.className}
                placeholder={props.placeholder}
                isClearable
                options={[props.allOption, ...props.options]}
                ref={props.innerRef}
                onChange={(selected, event) => {
                    if (selected !== null && selected.length > 0) {
                        if (selected[selected.length - 1].value === props.allOption.value) {
                            return props.onChange([props.allOption, ...props.options], event.name);
                        }
                        let result = [];
                        if (selected.length === props.options.length) {
                            if (selected.includes(props.allOption)) {
                                result = selected.filter(
                                    option => option.value !== props.allOption.value
                                );
                            } else if (event.action === "select-option") {
                                result = [props.allOption, ...props.options];
                            }
                            return props.onChange(result, event.name);
                        }
                    }

                    return props.onChange(selected, event.name);
                }}
                onCreateOption={props.onCreateOption}
            />
        );
    } else if (!props.allowSelectAll && props.creatable) {
        return (
            <CreatableSelect
                {...props}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize' }) }}
                menuPortalTarget={document.querySelector('modal-dialog')}
                className={props.className}
                placeholder={props.placeholder}
                isClearable
                options={[...props.options]}
                ref={props.innerRef}
                onChange={(selected, event) => {
                    return props.onChange(selected, event.name);
                }}
                onCreateOption={props.onCreateOption}
            />
        );
    } else if (props.allowSelectAll && !props.creatable) {
        return (
            <ReactSelect
                {...props}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize' }) }}
                menuPortalTarget={document.querySelector('modal-dialog')}
                className={props.className}
                placeholder={props.placeholder}
                isClearable
                options={[props.allOption, ...props.options]}
                ref={props.innerRef}
                onChange={(selected, event) => {
                    if (selected !== null && selected.length > 0) {
                        if (selected[selected.length - 1].value === props.allOption.value) {
                            return props.onChange([props.allOption, ...props.options], event.name);
                        }
                        let result = [];
                        if (selected.length === props.options.length) {
                            if (selected.includes(props.allOption)) {
                                result = selected.filter(
                                    option => option.value !== props.allOption.value
                                );
                            } else if (event.action === "select-option") {
                                result = [props.allOption, ...props.options];
                            }
                            return props.onChange(result, event.name);
                        }
                    }

                    return props.onChange(selected, event.name);
                }}
            />
        );
    } else if (!props.allowSelectAll && !props.creatable && !props.isAsync) {
        return (
            <ReactSelect
                {...props}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize' }) }}
                menuPortalTarget={document.querySelector('modal-dialog')}
                placeholder={props.placeholder}
                options={props.options}
                ref={props.innerRef}
                onChange={(selected, event) => {
                    return props.onChange(selected, event.name);
                }}
                className={props.className}
            />
        );
    } else if (props.isAsync) {
        return (<AsyncSelect
            {...props}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize'}) }}
            menuPortalTarget={document.querySelector('modal-content')}
            placeholder={props.placeholder}
            /*  onInputChange={(selected, event) => {
                 return props.onInputChange(selected, event.name);
             }} */
            onChange={(selected, event) => {
                return props.onChange(selected, event.name);
            }}
            className={props.className}
            ref={props.innerRef}
            cacheOptions
            loadOptions={props.loadOptions}
            defaultOptions={props.defaultOptions}
        />
        )
    }

    return <CreatableSelect {...props} styles={{ menuPortal: base => ({ ...base, zIndex: 9999, textTransform: 'capitalize' }) }}
        menuPortalTarget={document.querySelector('modal-dialog')}
        className={props.className}
    />;
};

MultiSelectComponent.propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onCreateOption: PropTypes.func,
    allowSelectAll: PropTypes.bool,
    creatable: PropTypes.bool,
    allOption: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    }),
    isAsync: PropTypes.bool,
    ref: PropTypes.any
};

MultiSelectComponent.defaultProps = {
    allOption: {
        label: "Select all",
        value: "*"
    }
};

export default MultiSelectComponent;
