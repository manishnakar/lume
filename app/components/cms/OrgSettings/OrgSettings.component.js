import React, {Component} from 'react'
import styled from 'styled-components'
import {H2} from '../../mia-ui/text'
import {Form, Label, Input, Select, Option, CheckboxInput} from '../../mia-ui/forms'
import {Button} from '../../mia-ui/buttons'
import CategoryGroupEditor from '../CategoryGroupEditor'
import {Page, Card} from '../../mia-ui/layout'
import {Flex, Box} from 'grid-styled'
import ManageUsers from '../ManageUsers'
import Head from '../../shared/head'
import {Link} from '../../mia-ui/links'

export default class OrgSettings extends Component {

  state = {
    name: "",
    newUsersRequireApproval: false,
    customObjApiEnabled: false,
    customObjApiEndpoint: "",
    customAnalyticsEnabled: false,
    customAnalyticsId: ""
  }

  constructor(props){
    super(props)
    this.state = {
      ...props.organization
    }
  }


  render() {

    if (!this.props.organization) return null

    const {
      state: {
        name,
        newUsersRequireApproval,
        customObjApiEnabled,
        customObjApiEndpoint,
        customAnalyticsId
      },
      handleChange,
      handleCheck,
      handleSave,
      props: {
        organization
      }
    } = this

    return (
        <Page>

          <Head
            title={`Settings –– ${organization.name}`}
          />

          <Flex
            w={1}
            mb={2}
          >
            <Link
              href={{
                pathname: '/cms',
                query: {
                  subdomain: organization.subdomain
                }
              }}
              as={`/cms/${organization.subdomain}`}
            >
              Back to Organization Home
            </Link>
          </Flex>
          <Flex
            w={1}
            mb={2}
          >

            <H2>
              {organization.name} settings
            </H2>
          </Flex>

          <Card>



            <Flex
              w={1}
            >
              <Label>
                Name
              </Label>

              <Input
                name={"name"}
                value={name}
                onChange={handleChange}
              />

            </Flex>

            <Flex
              w={1}
            >
              <Label>
                New Users Require Approval
              </Label>

              <input
                type={'checkbox'}
                value={"newUsersRequireApproval"}
                checked={organization.newUsersRequireApproval}
                onChange={handleCheck}
              />
            </Flex>

            <Flex
              w={1}
            >
              <Label>
                Use Custom Object API
              </Label>

              <input
                type={'checkbox'}
                value={"customObjApiEnabled"}
                checked={organization.customObjApiEnabled}
                onChange={handleCheck}
              />
            </Flex>

            <Flex
              w={1}
            >
              <Label>
                Custom Object API Endpoint
              </Label>

              <Input
                name={"customObjApiEndpoint"}
                value={customObjApiEndpoint}
                onChange={handleChange}
              />
            </Flex>

            <Flex
              w={1}
            >
              <Label>
                Use Custom Analytics
              </Label>

              <input
                type={'checkbox'}
                value={"customAnalyticsEnabled"}
                checked={organization.customAnalyticsEnabled}
                onChange={handleCheck}
              />
            </Flex>

            <Flex
              w={1}
            >
              <Label>
                Google Analytics ID
              </Label>

              <Input
                name={"customAnalyticsId"}
                value={customAnalyticsId}
                onChange={handleChange}
              />
            </Flex>



          </Card>

          <Card
            my={2}
          >
            <CategoryGroupEditor/>

          </Card>

          <Card
            my={2}
          >
            <ManageUsers/>

          </Card>


        </Page>
    )
  }

  bounce = true

  debounce = (func) => {
    if (this.bounce) {
      clearTimeout(this.bounce)
      this.bounce = setTimeout(
        func,
        2000
      )
    }
  }


  handleChange = ({target: {value, name}}) => {
    this.setState(
      ()=>({[name]: value}),
      ()=>{
        this.debounce(this.handleSave,2000)
      }
    )
  }

  handleCheck = ({target: {checked, value}}) => {
    this.setState(
      ()=>({[value]: checked}),
      this.handleSave
    )

  }

  componentWillReceiveProps(nextProps){
    if (
      nextProps.organization
    ) {
      if (
        nextProps.organization.id !== this.state.organizationId
      ) {
        this.setState({...nextProps.organization})
      }
    }
  }

  handleSave = () => {

    this.props.editOrganization({
      ...this.state
    })
  }


}
