import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';


const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: theme.palette.background.default,
    }
});

function Login(props) {
    const {
        token,
        registerToken, 
        authUrl, 
        redirectUrl, 
        originUrl,
        classes 
    } = props;

    if(!token) {
        window.location = authUrl;
        return (
        <div className={classes.container}>
                <Typography type="display1">
                    Redirecting you to the login page...
                </Typography>
        </div>
        );
    } else {
        registerToken(token).then(() => {
            if(window.opener) {
                window.opener.postMessage({
                    done: true,
                }, originUrl);
                setTimeout(() => window.close(), 500);
            }
        });
        return window.opener ? (
            <div className={classes.container}>
                <Typography type="display2">
                    You've been logged in!
                </Typography>
                <Typography type="body2">
                    This window will close automatically...
                </Typography>
            </div>
        ) : (
            <Redirect to="/"/>
        );
    }
}

Login.propTypes = {
    token: PropTypes.string,
    authUrl: PropTypes.string.isRequired,
    redirectUrl: PropTypes.string.isRequired,
    registerToken: PropTypes.func.isRequired,
};


export default withStyles(styles)(Login);