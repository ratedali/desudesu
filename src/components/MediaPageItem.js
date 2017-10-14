import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Hidden from 'material-ui/Hidden';
import Collapse from 'material-ui/transitions/Collapse';
import { mediaUrlById } from "../utils"

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
    desc: {
        maxHeight: '5em',
        overflow: 'hidden',
        wordWrap: 'break-word',
        textOverflow: 'ellipsis',
    },
    cover: {
    },
    actions: {
        justifyContent: 'center', },
    spacer: {
        flex: '1 1 auto',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
});

class MediaPageItem extends Component {
    static propTypes = {
        media: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired
    };

    state = {
        expanded: false
    }

    toggleDesc = () => this.setState({ expanded: !this.state.expanded });

    render() {
        const { classes, type, media } = this.props;
        const desc = (
            <CardContent className={classes.desc}>
                <Typography paragraph>
                    {media.description ?
                     media.description.replace(/<\/?.+?\/?>/g, '') : media.description}
                </Typography>
            </CardContent>
        );
        return (
            <Card className={classes.card}>
                <CardMedia className={classes.cover}
                component="img"
                src={media.coverImage.large}
                title={media.title.english ? media.title.english : media.title.romaji}/>
                <CardContent>
                    <Typography type="headline" component="h2" gutterBottom>
                        {media.title.romaji}
                    </Typography>
                    <Hidden smDown>
                        {desc}
                    </Hidden>
                    <Hidden mdUp>
                        <Collapse in={this.state.expanded} transitionDuration="auto">
                            {desc}
                        </Collapse>
                    </Hidden>
                </CardContent>
                <CardActions className={classes.actions}>
                    <IconButton>add</IconButton>
                    <IconButton>favorite</IconButton>
                    <div className={classes.spacer}/>
                    <IconButton className={classNames(classes.expand, {
                        [classes.expandOpen]: this.state.expanded,
                    })}
                    onClick={this.toggleDesc}
                    aria-expanded={this.state.expanded}
                    aria-label="Show description">
                    expand_more
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(MediaPageItem);