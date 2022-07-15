import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Cookies } from "react-cookie-consent";
import * as Constand from "../constant";
import { render } from 'react-dom';
import { commonService } from "../_services";

function renderPages(Component, authData, props, pathname, condition) {
    console.log('RenderPages')
    if ((authData && authData.isStudyUser && pathname)) {
        //not allowed SP to access all pages
        return (
            <Redirect to={{ pathname: '/home', state: { from: props.location, isRestrictedPage: true } }} />
        )
    } else if (authData && !authData.isStudyUser && !authData.isStudyLeader && !authData.isGroupLeader && !authData.isStudyUser && !authData.isStudyInstructor && condition && condition.toLowerCase().includes('research')) {
        //not allowed core beam to access RS pages
        return (
            <Redirect to={{ pathname: '/home', state: { from: props.location, isBeamRestrictedPage: true } }} />
        )
    }
    else {
        // return(<Redirect to={{ pathname: '/home', state: { from: props.location } }} />)
        return (
            <Component {...props} />
        )
    }
}

function processUrlAlias(condi, props) {
    // var  condi  = props.match.params;
    var newpath = props.location.pathname;
    var existCond = false;
    let url_alias_condition = JSON.parse(localStorage.getItem('url_alias_condition'));
    var matchParams = props.match;
    if (url_alias_condition) {
        url_alias_condition.forEach((val) => {
            if (condi in val.value) {
                console.log('condi', condi)
                console.log('condi-val.value', val.value[condi])
                newpath = props.location.pathname.replace(condi, val.value[condi]);
                condi = val.value[condi];
                existCond = condi ? true : false;
            }
        })
    }
    if (matchParams.params.condition != undefined) {
        matchParams.params.condition = condi;
        matchParams.url = newpath;
        props.match = matchParams;
        props.location.pathname = newpath;
    }
    var formatCondition = commonService.replaceChar(condi, false);
    Cookies.set("condition", formatCondition);
    //  return existCond;
}
// export const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={props => (
//         localStorage.getItem('user')
//             ? <Component {...props} />
//             : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//     )} />
// )

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        var { type, condition } = props.match.params;
        if (type || condition) {
            var condi = type || condition;
            processUrlAlias(condi, props)
            
        }
        return (
            (localStorage.getItem('user') || localStorage.getItem('userAuthToken') || props.splittedToken)
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
        )
    }
    } />
)

export const RegisterRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        (localStorage.getItem('user') || localStorage.getItem('userAuthToken'))
            ?
            <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
            : <Component {...props} />
    )} />
)

export const CommonRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => {
            var { condition } = props.match.params;
            if (props.match.params.type && props.match.params.type.length == 2) {
                condition = props.match.params.type
            }
            const parts = props.location.pathname.split('/');
            console.log('parts', parts[1]);
            var pathname = (Constand.SP_NOT_MENU.find(a => parts[1].includes(a))) ? true : false;
            let authData = JSON.parse(localStorage.getItem('userDetails'));
            console.log("my-condition", condition)
            if (condition) {
                processUrlAlias(condition, props);
                return (
                    renderPages(Component, authData, props, pathname, condition)
                )
            } else {
                return (
                    renderPages(Component, authData, props, pathname, condition)
                )
            }
        }
        } />
    )
};


export const ConditionRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => {
            var { condition } = props.match.params;
            var pathname = (props.location.pathname == '/howitswork') ? '/howitworks' : '/home';
            if (condition) {
                var condi = condition;
                processUrlAlias(condi, props)

                /*  urlConditions.forEach((val) => {
                     if (condi in val.value) {
                         condi = val.value[condi]
                     }
                 }) */
            }
            return (
                Constand.CONDITION_LIST.indexOf(commonService.replaceChar(condition, true)) > 0 && commonService.replaceChar(condition, true) == Constand.KR_CONDITION ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: pathname, state: { from: props.location } }} />
            )
        }
        } />
    )
};