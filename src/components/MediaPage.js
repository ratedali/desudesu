import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import MediaPageItem from './MediaPageItem';

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
    circularProgress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    linearProgress: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    }
});

class MediaPage extends Component {
    static propTypes = {
        mediaType: PropTypes.string.isRequired,
        season: PropTypes.string,
        seasonYear: PropTypes.string,
        search: PropTypes.string,
        perPage: PropTypes.number,
        page: PropTypes.number,
        hasNextPage: PropTypes.bool,
        isLoading: PropTypes.bool,
        media: PropTypes.array,
        error: PropTypes.string,
        loadMediaPage: PropTypes.func.isRequired,
        reloadMediaPages: PropTypes.func.isRequired,
    }

    state = {
        snackbar: false,
    }

    handleSnackBarClose = (e, reason) => {
        if(reason !== 'clickaway') {
            this.setState({ snackbar: false });
        }
    }

    handleScroll = (event) => {
        const currentScroll = window.pageYOffset + window.innerHeight;
        const fullHeight = window.document.body.scrollHeight;
        const trigger = Math.floor(fullHeight / 5); // pixels trigger next page fetch
        if(currentScroll >= fullHeight - trigger && !this.props.isLoading) {
            window.requestAnimationFrame(() => {
                this.loadPage(this.props.page + 1);
            });
        }
    };

    componentWillMount() {
        this.loadPage(this.props.page);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillReceiveProps(nextProps) {
        if((nextProps.media || nextProps.error) && !nextProps.hasNextPage) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.mediaType === prevProps.mediaType) {
            if(this.props.season !== prevProps.season ||
                this.props.seasonYear !== prevProps.seasonYear ||
                this.props.search !== prevProps.search) {
                    this.reloadPages();
                }
        }

        if(this.props.error && !this.state.snackbar) {
            this.setState({ snackbar: true });
        }

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    mediaLoadVars(page) {
        const {
            perPage,
            mediaType, 
            season,
            seasonYear, 
            search,
        } = this.props;

        let vars = { 
            page,
            perPage,
            type: mediaType
         };

        if(season && seasonYear) {
            vars = {
                ...vars,
                season: season.toUpperCase(),
                seasonYear
            };
        }

        if (search) {
            vars = {
                ...vars,
                search
            };
        }

        return vars;
    }

    loadPage(page) {
        return this.props.loadMediaPage(this.mediaLoadVars(page));
    }

    reloadPages() {
        return this.props.reloadMediaPages(this.mediaLoadVars(1));
    }

    render() {
        let {
            mediaType,
            isLoading,
            media,
            classes
        } = this.props;

        return (
            <div>
                <Grid container justify='space-around' direction='row' wrap="wrap">
                    { media ?
                        media.map(media => (
                            <Grid item key={media.id}
                            classes={{
                                typeItem: classes.gridItem
                            }}
                            xs={12} sm={6} md={4} lg={3}>
                                <MediaPageItem media={media} type={mediaType}/>
                            </Grid>)) :
                            isLoading ? 
                                <CircularProgress classNames={classes.progress} size={400} color="accent"/> :
                                null
                    }
                    {
                        (media && isLoading) ? 
                            <LinearProgress color="accent"/> :
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
                     <IconButton key="close" aria-label="close" color="inherit" 
                      className={classes.snackbarClose} onClick={this.handleSnackBarClose}>
                         close
                     </IconButton>
                 ]}/>
            </div>
        );
    }
}

export default withStyles(styles)(MediaPage);