import styled from 'styled-components'

import Context from './Context'

import Row from './Grids/Row'
import Cell from './Grids/Cell'
import Conditional from './Conditional'
import Container from './Grids/Container'

import { Link, Switch } from 'react-router-dom'

import Block from './Block'
import Button from './Button'
import Checkbox from './Checkbox'
import DateTimePicker from './DateTimePicker'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import List from './List'
import LoadingIndicator from './LoadingIndicator'
import Modal from './Modal'
import PeriodSelector from './PeriodSelector'
import RadioButton from './RadioButton'
import Range from './Range'
import Remote from './Remote'
import Route from './Route'
import Spacer from './Spacer'
import Select from './Select'
import Table from './Table'

const components = {
  Context,
  Row,
  Cell,
  Conditional,
  Container,
  Link,
  Switch,
  Block,
  Button,
  Checkbox,
  DateTimePicker,
  Icon,
  Input,
  Label,
  List,
  LoadingIndicator,
  Modal,
  PeriodSelector,
  RadioButton,
  Range,
  Remote,
  Route,
  Spacer,
  Select,
  Conditional,
  Table,
}

export default Object.keys(components).reduce((memo, key) => ({
  ...memo,
  [key]: styled(components[key])`${(props = {}) => props.style || ''}`,
}), {})
