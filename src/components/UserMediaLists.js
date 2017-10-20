import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import Hidden from 'material-ui/Hidden';
import MediaList from '../containers/MediaListContainer';
import { mediaListLabelFromType as mediaListLabel } from '../utils';

const styles = theme => ({
    list: {
        margin: `${theme.spacing.unit * 4}px 0`,
    },
});

class UserMediaLists extends Component {
    static propTypes = {
        username: PropTypes.string.isRequired,
        mediaType: PropTypes.string.isRequired,
        isLoading: PropTypes.bool,
        error: PropTypes.string,
        listTypes: PropTypes.arrayOf(PropTypes.string),
        customListTypes: PropTypes.arrayOf(PropTypes.string),
        loadMediaLists: PropTypes.func.isRequired,
    };

    state = {
        currentList: 'status_current'
    }

    tabChange = (event, value) => this.setState({ currentList: value })

    componentDidMount() {
        this.props.loadMediaLists({
            username: this.props.username,
            mediaType: this.props.mediaType,
        });
    }

    render() {
        const {
            classes,
            mediaType,
            listTypes,
            customListTypes
        } = this.props;

        const lists = listTypes && customListTypes ? listTypes.map(type => ({
            label: mediaListLabel(mediaType)(type),
            type,
            key: `status_${type}`,
            custom: false
        })).concat(customListTypes.map(type => ({
            type,
            label: type,
            key: `custom_${type}`,
            custom: true
        }))) : undefined;

        const keyTypeMap = new Map();
        if(lists) {
            for(let { key, type, custom } of lists) {
                keyTypeMap.set(key, {type, custom});
            }
        }

        const tabs = lists ? lists.map(({label, key}) => (
            <Tab key={key} value={key} label={label}/>
        )) : null;

        const {
            type: selectedListType,
            custom: selectedListIsCustom
        } = lists ? keyTypeMap.get(this.state.currentList) : {};

        return (lists ? (
            <div>
                <Hidden mdUp>
                    <Tabs indicatorColor="primary" fullWidth scrollable
                    value={this.state.currentList} onChange={this.tabChange}>
                        {tabs}
                    </Tabs>
                </Hidden>
                <Hidden smDown>
                    <Tabs indicatorColor="primary" centered
                    value={this.state.currentList} onChange={this.tabChange}
                    scrollButtons="auto">
                        {tabs}
                    </Tabs>
                </Hidden>
                <div className={classes.list}>
                    <MediaList listType={selectedListType} custom={selectedListIsCustom}/>
                </div>
            </div>
            ) : null
        )
    }
}

export default withStyles(styles)(UserMediaLists);