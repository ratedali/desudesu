import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import apiSpec from '../apiSpec';

const styles = theme => ({
    controls: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: theme.spacing.unit * 3
    },
    form: {
        display: 'flex',
        wrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    }
});

class MediaPageFilter extends Component{
    static propTypes = {
        mediaType: PropTypes.string.isRequired,
        seasonYear: PropTypes.string,
        season: PropTypes.string,
        search: PropTypes.string,
        filterChange: PropTypes.func.isRequired,
    }

    filterChange = filter => ({ target: { value }}) => {
        const {
            mediaType,
            seasonYear,
            season,
            search
        } = this.props;
        const oldFilters = {
            mediaType,
            seasonYear,
            season,
            search
        };
        this.props.filterChange({
            ...oldFilters,
            [filter]: value
        })
    }

    render() {
        const {
            seasonYear,
            season,
            classes
        } = this.props;

        const { seasons } = apiSpec;

        return (
            <div className={classes.controls}>
                <form className={classes.form} autoComplete="off">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="mpf-seasons">Season</InputLabel>
                        <Select value={season || ""}
                        onChange={this.filterChange('season')}
                        input={<Input id="mpf-seasons"/>}>
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value={seasons.winter}>Winter</MenuItem>
                            <MenuItem value={seasons.spring}>Spring</MenuItem>
                            <MenuItem value={seasons.summer}>Summer</MenuItem>
                            <MenuItem value={seasons.fall}>Fall</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="mpf-year">Year</InputLabel>
                        <Input id="mpf-year" type="number"
                        onChange={e => {
                            if(e.target.value.match(/\d{4}/))
                                this.filterChange("seasonYear")(e);
                            }
                        }
                        defaultValue={seasonYear}/>
                    </FormControl>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(MediaPageFilter);