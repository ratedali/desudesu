import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, Link } from "react-router-dom";
import classNames from 'classnames';
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import Button from "material-ui/Button";
import Avatar from "material-ui/Avatar";
import Hidden from "material-ui/Hidden";
import { FormControl } from "material-ui/Form";
import Input from "material-ui/Input";
import MediaPageFilter from "../containers/MediaPageFilterContainer";
import apiSpec from "../apiSpec";

const drawerWidth = 320;
const styles = theme => ({
    root: {
        width: '100%',
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
        },
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    openDrawer: {
        marginLeft: 12,
        marginRight: 20,
    },
    hideOpenDrawer: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: {
        ...theme.mixins.toolbar,
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
        },
    },
    drawerPaper: {
        width: 250,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            height: '100%'
        }
    },
    selectedSection: {
        background: theme.palette.primary["500"],
    },
    selectedSectionText: {
        color: theme.palette.shades.dark.text.primary,
    },
    title: {
        flex: 1
    },
    navItem: {
        margin: `0 ${theme.spacing.unit}px`,
        textDecoration: 'none',
    },
    search: {
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        background: theme.palette.primary["400"],
        "&:hover": {
            background: theme.palette.primary["300"],
        }
    },
    searchIcon: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    searchText: {
        color: theme.palette.shades.dark.input.inputText,
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        flex: 1,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
        [theme.breakpoints.up('md')]: {
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        }
    },
    contentShift: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }
    },
    filter: {
        
    },
});

class Nav extends Component {

    static propTypes = {
        currentSection: PropTypes.string.isRequired,
        loggedIn: PropTypes.bool.isRequired,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar: PropTypes.shape({
                medium: PropTypes.string,
            }).isRequired,
        }),
        userLoading: PropTypes.bool,
        userError: PropTypes.bool,
        navigateTo: PropTypes.func.isRequired,
        searchFor: PropTypes.func.isRequired,
        refreshLogin: PropTypes.func.isRequired,
    }

    state = {
        drawer: false,
    }

    toggleDrawer = () => {
        this.setState({ drawer: !this.state.drawer });
    }

    openDrawer = () => this.setState({ drawer: true });
    closeDrawer = () => this.setState({ drawer: false });

    navigateTo = path => () => this.props.navigateTo(path)
    handleSearch = mediaType => e => {
        if(e.keyCode === 13 || e.which === 13) {
            this.props.searchFor(mediaType, e.target.value);
        }
    }

    handleLogin = e => {
        window.open(apiSpec.auth.url);
        window.addEventListener('message', this.refreshMessageListener);
    }

    refreshMessageListener = e => {
        if(e.data.done) {
            console.log("refreshing");
            this.props.refreshLogin();
            window.removeEventListener('message', this.refreshMessageListener);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.refreshMessageListener);
    }

    render() {
        const { 
            currentSection,
            loggedIn,
            user,
            userLoading,
            userError,
            classes,
            theme, 
        } = this.props;

        const drawerContent = (
            <div>
                <Divider/>
                {user && !userLoading && !userError ? 
                <div>
                    <ListItem onClick={this.navigateTo('/profile')}>
                        <Avatar alt={user.name} src={user.avatar.medium}/>
                        <ListItemText primary="Profile" secondary={user.name}/>
                    </ListItem>
                    <Divider/>
                </div> :
                null
                }
                <List>
                    {[
                        ['/', 'home', 'Home', 'home'],
                        ['/browse', 'dashboard', 'Browse', 'browse'],
                        ['/list/anime', 'video_library', 'Anime List', 'anime'],
                        ['/list/manga', 'photo_library', 'Manga List', 'manga']
                    ].map(([path, icon, title, key]) => (
                            <ListItem onClick={this.navigateTo(path)} key={key}
                             button divider
                             className={classNames({
                                 [classes.selectedSection]: key === currentSection
                             })}>
                                <ListItemIcon>
                                    <Icon 
                                    color={key === currentSection ? 'contrast' : 'inherit'}>
                                        {icon}
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText primary={title} 
                                classes={{
                                    text: classNames({
                                            [classes.selectedSectionText]: key === currentSection
                                          })
                                }}/>
                            </ListItem>))}
                </List>
            </div>
        );

        return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classNames(classes.appBar, this.state.drawer && classes.appBarShift)}>
                <Toolbar disableGutters={!this.state.drawer}>
                    <IconButton className={classNames(classes.openDrawer, this.state.drawer && classes.hideOpenDrawer)}
                    color="contrast" aria-label="open drawer" onClick={this.openDrawer}>
                        menu
                    </IconButton>
                    <Typography type="title" color="inherit" 
                    className={classes.title} noWrap>
                        DesuDesu
                    </Typography>
                    <Route path="/browse/:mediaType" render={({match}) => 
                        (
                            <form>
                            <FormControl className={classes.search}>
                                    <Icon className={classes.searchIcon}>search</Icon>
                                    <Input disableUnderline aria-label="Search" 
                                    className={classes.searchText}
                                     onKeyPress={this.handleSearch(match.params.mediaType)}/>
                                </FormControl>
                            </form>
                        )}/>
                    <IconButton color="contrast">
                        settings
                    </IconButton>
                   { !loggedIn ?
                    <IconButton color="contrast" onClick={this.handleLogin}>
                        account_circle
                    </IconButton> :
                    null
                   }
                </Toolbar>
            </AppBar>
            <Hidden mdUp>
                <Drawer
                type="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.drawer}
                onRequestClose={this.toggleDrawer}
                classes={{
                    paper: classes.drawerPaper
                }}
                ModalProps={{
                    keepMounted:　true
                }}>
                    <div>
                        <div className={classes.drawerHeader}/>
                        {drawerContent}
                    </div>
                </Drawer>
            </Hidden>
            <div className="appFrame">
                <Hidden smDown>
                    <Drawer
                    type="presistent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    open={this.state.drawer}
                    ModalProps={{
                        disableBackdrop: true
                    }}>
                    <div>
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.closeDrawer}>
                                {theme.direction === 'rtl' ? 'chevron_right' : 'chevron_left'}
                            </IconButton>
                        </div>
                        {drawerContent}
                    </div>
                    </Drawer>
                </Hidden>
                <div className={classNames(classes.content, this.state.drawer && classes.contentShift)}>
                    <div className={classes.filter}>
                    <Switch >
                        <Route path="/browse/:mediaType/search/:search" component={MediaPageFilter}/>
                        <Route path="/browse/:mediaType/:seasonYear/:season" component={MediaPageFilter}/>
                    </Switch>
                    </div>
                    {this.props.children}
                </div>
            </div>
        </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Nav);