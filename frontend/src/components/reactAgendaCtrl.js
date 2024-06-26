// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import {baseApiUrl} from '../global'
import {getLast , getFirst } from './helpers.js';
import Rdate from 'react-datetime';
import './reactAgendaCtrl.css';

var now = new Date();


export default class ReactAgendaCtrl extends Component {
  constructor() {
    super();
    this.state = {
      editMode: false,
      showCtrl: false,
      multiple: {},
      name: '',
      classes: 'priority-1',
      startDateTime: now,
      endDateTime: now,
      idpessoa: null,
      recorrencia: false,
      dataRecorrencia: moment().format('YYYY-MM-DD'),
      intervaloRecorrencia: 1
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.addEvent = this.addEvent.bind(this)
    this.updateEvent = this.updateEvent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  componentDidMount() {
  if (this.props.itemColors) {
    this.setState({
      classes: Object.keys(this.props.itemColors)[0]
    })

  }
  setTimeout(function() {
    if(this.refs.eventName){
        this.refs.eventName.focus()
    }

  }.bind(this), 50);

  if (!this.props.selectedCells) {
    let start = now
    let endT = moment(now).add(15, 'Minutes');
    return this.setState({editMode: false, name: '', startDateTime: start, endDateTime: endT, dataRecorrencia: moment(endT).format('YYYY-MM-DD'), idpessoa: this.props.pessoaList[0] ? this.props.pessoaList[0].id : null});
  }
  
  if (this.props.selectedCells && this.props.selectedCells[0] && this.props.selectedCells[0]._id) {
    let start = moment(this.props.selectedCells[0].startDateTime);
    let endT = moment(this.props.selectedCells[0].endDateTime);
    
    return this.setState({editMode: true, name: this.props.selectedCells[0].name, classes: this.props.selectedCells[0].classes, startDateTime: start, endDateTime: endT, dataRecorrencia: moment(endT).format('YYYY-MM-DD'), idpessoa: this.props.selectedCells[0].idpessoa});
    
  }
  
  if (this.props.selectedCells && this.props.selectedCells.length === 1) {
    let start = moment(getFirst(this.props.selectedCells));
    let endT = moment(getLast(this.props.selectedCells)).add(15, 'Minutes');
    return this.setState({editMode: false, name: '', startDateTime: start, endDateTime: endT, dataRecorrencia: moment(endT).format('YYYY-MM-DD'), idpessoa: this.props.pessoaList[0] ? this.props.pessoaList[0].id : null});
  }

  if (this.props.selectedCells && this.props.selectedCells.length > 0) {
    let start = moment(getFirst(this.props.selectedCells));
    let endT = moment(getLast(this.props.selectedCells)) || now;
    this.setState({editMode: false, name: '', startDateTime: start, endDateTime: endT, dataRecorrencia: moment(endT).format('YYYY-MM-DD'), idpessoa: this.props.pessoaList[0] ? this.props.pessoaList[0].id : null});
  }

}

  handleChange(event) {
    if(event.target.tagName === 'BUTTON'){
      event.preventDefault();
    }

    var data = this.state;
    data[event.target.name] = event.target.value;
    this.setState(data);
  }

  handleDateChange(ev, date) {
    var endD = moment(this.state.endDateTime)
  var data = this.state;
  data[ev] = date;

  if(ev === 'startDateTime' && endD.diff(date)< 0 ){
    data['endDateTime'] = moment(date).add(15 , 'minutes');
  }

  this.setState(data);

  }

  addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

addEvent = async (e) => {
  if (this.state.name.length < 1) {
    return;
  }

  if(this.props.selectedCells && this.props.selectedCells.length > 0){
    
    var postObj = {
      descricao: this.state.name,
      datahoraini: this.state.startDateTime,
      datahorafim: this.state.endDateTime,
      sglcor: this.state.classes,
      idsala: this.props.selectedSala,
      idpessoa: this.state.idpessoa
    }

    try {
      await axios.post(`${baseApiUrl}/agendamentos`, postObj)
    } catch(err) {
      alert(err)
    }

    if (this.state.recorrencia) {
      var dateStartRec = this.addDays(this.state.startDateTime, 7 * this.state.intervaloRecorrencia)
      var dateEndRec = this.addDays(this.state.endDateTime, 7 * this.state.intervaloRecorrencia)
      while(dateEndRec < this.addDays(new Date(this.state.dataRecorrencia),1)) {

        const postObjRec = {
          ...postObj,
          datahoraini: dateStartRec ,
          datahorafim: dateEndRec 
        }

        try {
          await axios.post(`${baseApiUrl}/agendamentos`, postObjRec)
        } catch(err) {
          alert(err)
        }

        dateStartRec = this.addDays(dateStartRec, 7 * this.state.intervaloRecorrencia)
        dateEndRec = this.addDays(dateEndRec, 7 * this.state.intervaloRecorrencia)

      }
    }

   return this.props.Addnew()

  }

}

updateEvent= async (e) => {
  if (this.props.selectedCells[0]._id && this.props.items) {

    var newObj = {
      descricao: this.state.name,
      idpessoa: this.state.idpessoa,
      datahoraini: this.state.startDateTime,
      datahorafim: this.state.endDateTime,
      sglcor: this.state.classes
    }

    try {
      await axios.put(`${baseApiUrl}/agendamentos/${this.props.selectedCells[0]._id}`, newObj)
    } catch(err) {
      alert(err)
    }
  }

  return this.props.edit()
}


handleSubmit(e) {
  e.preventDefault();
  this.addEvent(e);
}

handleEdit(e) {
  e.preventDefault();
  this.updateEvent(e);
}

render() {
  var itc = Object.keys(this.props.itemColors)
  var colors = itc.map(function(item, idx) {

    return <div style={{
      background: this.props.itemColors[item]
    }} className="agendCtrls-radio-buttons" key={item}>
      <button name="classes"  value={item} className={this.state.classes === item?'agendCtrls-radio-button--checked':'agendCtrls-radio-button'} onClick={this.handleChange.bind(this)}/>
    </div>
  }.bind(this))

  const divStyle = {};

  if (this.state.editMode) {

    return (
      <div className="agendCtrls-wrapper" style={divStyle}>
        <form onSubmit={this.handleEdit}>
          <div className="agendCtrls-label-wrapper">
            <div className="agendCtrls-label-inline">
              <label>Nome do evento</label>
              <input type="text" name="name" autoFocus ref="eventName" className="agendCtrls-event-input" value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Event Name"/>
            </div>
            <div className="agendCtrls-label-inline ">
              <label>Cor de fundo</label>
              <div className="agendCtrls-radio-wrapper">
                {colors}</div>
            </div>
          </div>
          <div className="agendCtrls-label-wrapper">
          <div className="agendCtrls-label-inline">
            <label>Responsável</label>
            <select name="idpessoa" value={this.state.idpessoa} onChange={this.handleChange.bind(this)}>
              {this.props.pessoaList.map((pessoa) => <option value={pessoa.id}>{pessoa.nome}</option>)}
            </select>
                  </div>
        </div>
          <div className="agendCtrls-timePicker-wrapper">
            <div className="agendCtrls-time-picker">
              <label >Data de início</label>
              <Rdate value={this.state.startDateTime} onChange={this.handleDateChange.bind(null, 'startDateTime')} input={false} viewMode="time" ></Rdate>
            </div>
            <div className="agendCtrls-time-picker">
              <label >Data de fim</label>
              <Rdate value={this.state.endDateTime} onChange={this.handleDateChange.bind(null, 'endDateTime')} input={false} viewMode="time" ></Rdate>
            </div>
          </div>
          <input type="Submit" value="Enviar"/>
        </form>
      </div>
    );

  }

  return (
    <div className="agendCtrls-wrapper" style={divStyle}>
      <form onSubmit={this.handleSubmit}>
        <div className="agendCtrls-label-wrapper">
          <div className="agendCtrls-label-inline">
            <label>Nome do evento</label>
            <input type="text" ref="eventName" autoFocus name="name" className="agendCtrls-event-input" value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Nome do evento"/>
          </div>
          <div className="agendCtrls-label-inline">
            <label>Cor de fundo</label>
            <div className="agendCtrls-radio-wrapper">
              {colors}</div>
          </div>
        </div>
        <div className="agendCtrls-label-wrapper">
          <div className="agendCtrls-label-inline">
            <label>Responsável</label>
            <select name="idpessoa" value={this.state.idpessoa} onChange={this.handleChange.bind(this)}>
              {this.props.pessoaList.map((pessoa) => <option value={pessoa.id}>{pessoa.nome}</option>)}
            </select>
                  </div>
        </div>
        <div className="agendCtrls-timePicker-wrapper">
          <div className="agendCtrls-time-picker">
            <label >Data de início</label>
            <Rdate value={this.state.startDateTime} onChange={this.handleDateChange.bind(null, 'startDateTime')} input={false} viewMode="time" ></Rdate>
          </div>
          <div className="agendCtrls-time-picker">
            <label >Data de fim</label>
            <Rdate value={this.state.endDateTime} onChange={this.handleDateChange.bind(null, 'endDateTime')} input={false} viewMode="time" ></Rdate>
          </div>
        </div>
        <div className="agendCtrls-label-wrapper">
          <div className="agendCtrls-label-inline">
            <label>Recorrência <input
              name="recorrencia"
              type="checkbox"
              checked={this.state.recorrencia}
              onChange={(event) => {
                this.setState({
                  recorrencia: event.target.checked
                })
              }} />
              </label>
          </div>
          { this.state.recorrencia && 
          <div className="agendCtrls-label-wrapper">
            <div className="agendCtrls-label-inline">
              Até:
                <input
                  name="dataRecorrencia"
                  type="date"
                  min={moment(this.state.endDateTime).format('YYYY-MM-DD')}
                  value={this.state.dataRecorrencia}
                  onChange={(event) => {
                    this.setState({
                      dataRecorrencia: event.target.value
                    })
                  }} />
            </div> 
            <div className="agendCtrls-label-inline">
              A cada: 
              <input
                name="intervaloRecorrencia"
                type="number"
                value={this.state.intervaloRecorrencia}
                onChange={(event) => {
                  this.setState({
                    intervaloRecorrencia: event.target.value
                  })
                }} />
              semanas
            </div>
          </div>
          }
        </div>
        
        <input type="Submit" value="Enviar"/>
      </form>
    </div>
  );
}
}


ReactAgendaCtrl.propTypes = {
  items: PropTypes.array,
  itemColors: PropTypes.object,
  selectedCells: PropTypes.array,
  edit: PropTypes.func,
  Addnew: PropTypes.func

};

ReactAgendaCtrl.defaultProps = {
  items: [],
  itemColors: {},
  selectedCells: []
  }
