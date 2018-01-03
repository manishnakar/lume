import React, {Component} from 'react'
import styled from 'styled-components'
import {s3Url, googleApiKey} from '../../../config'
import {Spinner} from '../../ui/spinner'

export default class extends Component {

  static defaultProps = {
    height: "",
    quality: "m",
    width: "",
    thumb: false,
    size: "50px",
    selected: false
  }

  state = {
    src: ""
  }

  render () {

    if (
      this.props.data.loading
    ) return null

    if (!this.props.imageId) {
      return null
    }

    const {
      props: {
        thumb,
        size,
        selected,
        onClick,
        height,
        width,
      },
      state: {
        src
      }
    } = this



    if (!src) return (
      <SpinnerBox
        height={height}
        width={width}
        size={size}
      >
        <Spinner/>
      </SpinnerBox>
    )

    if (thumb) {
      return (
        <Thumb
          src={src}
          selected={selected}
          onClick={onClick}
          size={size}
        />
      )
    }


    return (
      <Img
        src={src}
        onClick={onClick}
        height={height}
        width={width}
      />
    )
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.data.image) {
      this.generateSrc(nextProps)
    }
  }


  generateSrc = async (nextProps) => {
    try {
      const {
        data: {
          image: {
            id: imgId,
            localId,
            organization: {
              id: orgId,
              customImageApiEnabled,
            },
          }
        },
        quality
      } = nextProps

      let imgQuality = quality || 'm'

      if (
        customImageApiEnabled
      ){
        let src = `https://cdn.dx.artsmia.org/thumbs/tn_${localId}.jpg`
        this.setState({src})
      } else {
        this.setState({src: `https://s3.amazonaws.com/${orgId}/${imgId}/${imgQuality}`})
      }

      if (process.env.FILE_STORAGE === "offline") {
        this.setState({
          src: `http://localhost:5000/static/${imgId}/${imgQuality}.jpg`
        })
      }

    } catch (ex) {
      console.error(ex)
    }
  }




}

const Img = styled.img`
  height: ${({height}) => height};
  width: ${({width}) => width};
  object-fit: contain;
  margin: 10px;
`

const Thumb = styled.img`
  height: ${({size}) => size};
  width: ${({size}) => size};
  box-shadow:  ${({theme, selected}) => (selected) ? `0 0 10px 5px ${theme.colors.purple}` : ""};
  object-fit: cover;
  margin: 10px;
`

const SpinnerBox = styled.div`
  height: ${({height, size}) => height || size || '50px'};
  width: ${({width, size}) => width || size || '50px'};
  display: flex;
  justify-content: center;
  align-items: center;
`
