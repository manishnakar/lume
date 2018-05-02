import React, {Component} from 'react'
import styled from 'styled-components'
import {ChangeImage} from '../DefaultEditors'
import {Button} from '../../mia-ui/buttons'
import {CheckboxInput, Label, Input} from '../../mia-ui/forms'
import {Flex, Box} from 'grid-styled'
import {Expander} from '../../mia-ui/expanders'
import ImgSrcProvider from '../../shared/ImgSrcProvider'

export default class ObjEditor extends Component {

  initialState = {
    id: "",
    title: "",
    description: "",
    attribution: "",
    date: "",
    accessionNumber: "",
    medium: "",
    dimensions: "",
    currentLocation: "",
    creditLine: "",
    pullFromCustomApi: false,
    localId: "",
    exp: true
  }

  state = {
    ...this.initialState
  }


  render(){

    if (!this.props.obj || !this.props.organization) return null

    const {
      state,
      handleChange,
      handleSave,
      handleCheck,
      props: {
        organization,
        obj
      },
      state: {
        exp
      }
    } = this

    let disabled = this.props.organization.customObjApiEnabled

    return (
      <Expander
        open={exp}
        onRequestOpen={() => this.setState({exp: true})}
        onRequestClose={() => this.setState({exp: false})}

      >
        <Flex
          flexWrap={'wrap'}
          w={1}
        >
          {this.props.organization.customObjApiEnabled ? (
            <Flex
              w={1}
            >
              <Label>
                Pulling From Custom API
              </Label>
              <CheckboxInput
                name={"pullFromCustomApi"}
                checked={state.pullFromCustomApi}
                onChange={handleCheck}
                disabled
              />
            </Flex>
          ): null}
          {this.props.organization.customObjApiEnabled ? (
            <Box
              w={1}
            >
              <Label>
                Local ID
              </Label>
              <Input
                placeholder={"Local ID"}
                name={"localId"}
                value={state.localId}
                onChange={handleChange}
                disabled={disabled}
              />
            </Box>
          ): null}

          <Box
            w={1}
          >
            <Label>
              Title
            </Label>
            <Input
              placeholder={"Title"}
              name={"title"}
              value={state.title}
              onChange={handleChange}
              disabled={disabled}

            />
          </Box>
          <Box
            w={1}
          >
            <Label>
              Attribution
            </Label>
            <Input
              placeholder={"Attribution"}
              name={"attribution"}
              value={state.attribution}
              onChange={handleChange}
              disabled={disabled}

            />
          </Box>
          <Box
            w={1}
          >
            <Label>
              Current Location
            </Label>
            <Input
              placeholder={"Current Location"}
              name={"currentLocation"}
              value={state.currentLocation}
              onChange={handleChange}
              disabled={disabled}

            />
          </Box>
          <Box
            w={1}
          >
            <Label>
              Date
            </Label>
            <Input
              placeholder={"Date"}
              name={"date"}
              value={state.date}
              onChange={handleChange}
              disabled={disabled}

            />
          </Box>
          <Box
            w={1}
          >
            <ChangeImage
              label={"Image"}
              name={'primaryImageId'}
              image={obj.primaryImage}
              onChange={this.handleImageChange}
            />
          </Box>


        </Flex>
      </Expander>

    )
  }

  handleImageChange = ({target: {value, name}}) => {
    this.props.editObj({
      id: this.props.objId,
      primaryImageId: value
    })
  }

  bounce = true

  debounce = (func, wait) => {
    if (this.bounce) {
      clearTimeout(this.bounce)
      this.bounce = setTimeout(
        func,
        wait
      )
    }
  }

  handleChange = ({target: {value, name, checked}}) => {
    this.setState(
      () => ({[name]: value}),
      ()=>{
        this.debounce(this.handleSave, 1000)
      }
    )
  }

  handleCheck = ({target: {name, checked}}) => {
    this.setState(
      () => ({[name]: checked}),
      ()=>{
        this.debounce(this.handleSave, 1000)
      }
    )
  }

  handleSave = () => {
    this.props.editObj({
      ...this.state,
      __typename: undefined,
      exp: undefined
    })
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.obj){
      if (nextProps.obj.id !== this.state.id) {
        let {obj} = nextProps
        let state = {}
        Object.keys(obj).forEach( key => {
          Object.assign(state,{
            [key]: obj[key] || this.initialState[key]
          })
        })
        this.setState(state)
      }
    }
  }

}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  border: 1px solid grey;
  min-height: 500px;
`
