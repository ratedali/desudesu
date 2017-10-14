import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import MediaPageItem from './MediaPageItem';

const styles = theme => ({
    gridItem: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
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
    
    constructor(props) {
        super(props);
        this.handleScroll = (event) => {
            const trigger = 500; // pixels trigger next page fetch
            const currentScroll = window.pageYOffset + window.innerHeight;
            const fullHeight = window.document.body.scrollHeight;
            if(currentScroll >= fullHeight - trigger && !this.props.isLoading) {
                window.requestAnimationFrame(() => {
                    this.loadPage(this.props.page + 1);
                });
            }
        };
    }

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
            error,
            classes
        } = this.props;

        if(error && !media) {
            return <p> Error: {error} </p>;
        }

        if(isLoading && !media) {
            return <p> Loading... </p>;
        }

        if(!media) {
            return null;
        }

        return (
            <Grid container justify='space-around' direction='row' wrap="wrap">
                {
                    media.map(media => (
                        <Grid item key={media.id}
                        classes={{
                            typeItem: classes.gridItem
                        }}
                        xs={12} sm={6} md={4} lg={3}>
                            <MediaPageItem media={media} type={mediaType}/>
                        </Grid>))
                }
                { error ? <p>Error loading next page</p> : null }
                { isLoading ? <p>Loading next page </p> : null }
            </Grid>
        );
    }
}

export default withStyles(styles)(MediaPage);