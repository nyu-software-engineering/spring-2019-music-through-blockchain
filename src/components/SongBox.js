import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Grow from '@material-ui/core/Grow'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Zoom from '@material-ui/core/Zoom'
import styled from "@emotion/styled/macro";
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import DialogContent from '@material-ui/core/DialogContent';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";

import SongDetails from './SongDetails'

import { dbGetSongOwners } from '../store/actions/songActions'

const styles = theme => ( {
    root: {
        display: 'inline-block',
        marginRight: 25,
        marginTop: 25,
        backgroundColor: 'white',
        elevation: 3,
        overflow: 'hidden',
    },

    title: {
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '98%',
        left: 0,
        right: 0,
        bottom: 5,
        textAlign: 'center',
        zIndex: 1
    },

    subtitle: {
        position: 'relative',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        bottom: 20,
        zIndex: 1
    },

    cover: {
        top: 0,
        width: '100%',
    },

    audio: {
        display: 'flex',
        position: 'absolute',
        bottom: 0,
        left: 43,
        width: '50%',
        margin: 'auto',
        height: 50,
        contentAlign: 'center',
        alignItems: 'center',
        zIndex: 3,
      },
      
    modal: {
        margin: 'auto',
        width: 400,
        padding: '13% 0',
    },

})

//e-motion components
const Title = styled.h4({
    fontFamily: "Helvetica",
    transform: "translate3d(0,50px,0)",
    transition: "transform 350ms ease",
});

const SubTitle = styled.p({
    fontFamily: "Helvetica",
    transform: "translate3d(0,50px,0)",
    transition: "transform 350ms ease",
  });

const DisplayOver = styled.div({
    height: "100%",
    left: "0",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: 2,
    transition: "background-color 350ms ease",
    backgroundColor: "transparent",
    boxSizing: "border-box",
});

const Hover = styled.div({
    opacity: 0,
    transition: "opacity 350ms ease",
  });

  const Background = styled.div({
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: 'lightgrey',
    color: "#FFF",
    position: "relative",
    width: "100%",
    height: "100%",
    cursor: "pointer",
    [`:hover ${DisplayOver}`]: {
      backgroundColor: "rgba(0,0,0,.5)",
    },
    [`:hover ${Title}, :hover ${SubTitle}`]: {
      transform: "translate3d(0,0,0)",
    },
    [`:hover ${Hover}`]: {
      opacity: 1,
    },
  });

// SongBox component
export class SongBox extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            shadow: 1, 
            detailsOpen: false 
        }
    }

    componentWillMount() {
        const { song, songId } = this.props
        this.props.getSongOwners(song, songId)
    }

    onMouseOver = () => {
        this.setState({ shadow: 5 })
    };
    onMouseOut = () => {
        this.setState({ shadow: 1 })
    }
    goToSongPage = () => {
        const { history, songId } = this.props
            history.push(`/song/${songId}`)
            return <Redirect to={`/song/${songId}`} />
    }

    render() {
        const {songId, song, classes, theme, auth} = this.props
        const title = song['title']
        const artist = song['artistName']
        const coverArt = song['imageUrl']
        const media = song['songUrl']
        const ownerId = song['ownerId']
        const cardSize = 130
        const titleSize = 14
        const subtitleSize = 12
        const iconSize = 30

        console.log('songBox props: ', this.props)
        
        return (
        <div style={{display: 'inline'}}>
            <Card 
                className={classes.root} 
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                elevation={this.state.shadow}
                style={{width: cardSize, height: cardSize }}
            >
                <Background>
                    <img className={classes.cover} src={coverArt}></img>
                    <DisplayOver>
                        <Hover>
                            <Title style={{fontSize: titleSize}} className={classes.title} onClick={this.goToSongPage}>{title}</Title>
                            <SubTitle style={{fontSize: subtitleSize}} className={classes.subtitle} onClick={this.handleOpenModal}>{artist}</SubTitle>
                            <audio src={media} controls className={classes.audio}/>
                        </Hover>
                    </DisplayOver>
                </Background>    
            </Card>
         </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getSongOwners: (song, songId) => dispatch(dbGetSongOwners(song, songId)),
    }
}

export default withRouter(connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SongBox)))
