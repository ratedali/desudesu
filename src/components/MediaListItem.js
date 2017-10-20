import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import apiSpec from '../apiSpec';

const styles = theme => ({
    card: {
        width: '240px',
        [theme.breakpoints.up('sm')]: {
            minHeight: '400px',
        },
        [theme.breakpoints.up('md')]: {
            width: '320px',
            minHeight: '480px',
        }
    },
    actions: {
        justifyContent: 'center',
    },
    spacer: {
        flex: '1 1 auto',
    },
    statusButton: {
        fontSize: theme.typography.subheading.fontSize,
        fontWeight: theme.typography.button.fontWeight
    },
    progressContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

class MediaListItem extends Component {

    static propTypes = {
        mediaId: PropTypes.number.isRequired,
        mediaType: PropTypes.oneOf([
            apiSpec.mediaType.anime,
            apiSpec.mediaType.manga
        ]).isRequired,
        isLoading: PropTypes.bool,
        error: PropTypes.string,
        media: PropTypes.object,
        progress: PropTypes.number,
        score: PropTypes.number,
        loadMedia: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.loadMedia({
            id: this.props.mediaId,
            mediaType: this.props.mediaType
        });
    }

    render() {
        const {
            classes,
            mediaType,
            isLoading,
            media,
            progress,
            score,
        } = this.props;
        const {
            coverImage,
            title,
            [mediaType === apiSpec.mediaType.anime ? 'episodes' : 'chapters'] : total,
        } = media ? media : {};
        return (
            <Card className={classes.card}>
                { media ?
                <div>
                    <CardMedia className={classes.cover} component="img"
                    src={coverImage.large}
                    title={title.english ? title.english : title.romaji}/>
                    <CardContent>
                        <Typography type="headline" component="h2" gutterBottom>
                            {title.romaji}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                        <Button focusRipple className={classes.statusButton}>
                            {progress}/{total ? total : '?'}
                        </Button>
                        <IconButton>add</IconButton>
                        <div className={classes.spacer}/>
                        <Button focusRipple color="primary" className={classes.statusButton}>
                            {score}
                        </Button>
                    </CardActions>
                </div> :
                isLoading ? 
                <div className={classes.progressContainer}>
                    <CircularProgress className={classes.progress} size={160} color="accent"/>
                </div> :
                null
                }
            </Card>
        );
    }
}

export default withStyles(styles)(MediaListItem);