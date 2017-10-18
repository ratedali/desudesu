import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { registerToken } from '../actions/auth';
import queryString from 'query-string';
import apiSpec from '../apiSpec';
import Login from '../components/Login';

const mapStateToProps = (state, ownProps) => {

    const {
        location: {
            hash
        },
    } = ownProps;

    const {
        auth: {
            url: authUrl,
            redirect: redirectUrl,
            origin: originUrl
        }
    } = apiSpec;

    return {
        token: queryString.parse(hash)['access_token'],
        authUrl,
        redirectUrl,
        originUrl,
    };
};

export default withRouter(connect(mapStateToProps, { registerToken })(Login));