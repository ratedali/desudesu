import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import MediaListItem from '../containers/MediaListItemContainer';

const styles = theme => ({
    gridItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    snackbarClose: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
});

class MediaList extends Component {

    static propTypes = {
        username: PropTypes.string,
        mediaType: PropTypes.string.isRequired,
        listType: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        list: PropTypes.arrayOf(PropTypes.shape({
            mediaId: PropTypes.number.isRequired,
            progress: PropTypes.number,
            score: PropTypes.number,
            status: PropTypes.string,
        })),
        error: PropTypes.string,
    };

    state = {
        snackbar: false,
    }

    handleSnackBarClose = (e, reason) => this.setState({ snackbar: false });

    render() {
        const {
            classes,
            isLoading,
            list
        } = this.props;
        return (
            <div>
                <Grid container justify="space-around" direction="row" wrap="wrap"
                align="flex-end">
                    { list ?
                        list.map((item) => (
                            <Grid item key={item.mediaId}
                            classes={{
                                typeItem: classes.gridItem
                            }}
                            xs={12} sm={6} md={4} lg={3}>
                                <MediaListItem mediaInfo={item}/>
                            </Grid>
                        )) :
                        isLoading ?
                        <CircularProgress className={classes.progress} size={400} color="accent"/> :
                        null
                    }
                </Grid>
                <Snackbar
                 anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                 }}
                 open={this.state.snackbar}
                 autoHideDuration={3000}
                 onRequestClose={this.handleSnackBarClose}
                 SnackbarContentProps={{
                     'aria-describedby': 'mp-error',
                 }}
                 message={<span id="mp-error">There was an error loading the page</span>}
                 action={[
                     <Hidden smDown>
                        <IconButton key="close" aria-label="close" color="inherit" 
                        className={classes.snackbarClose} onClick={this.handleSnackBarClose}>
                            close
                        </IconButton>
                    </Hidden>
                 ]}/>
            </div>
        );
    }
}

export default withStyles(styles)(MediaList);