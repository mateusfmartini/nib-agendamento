// @flow
import React, { Component } from 'react'
import moment from 'moment'
import '../components/style.css'
import ReactAgenda from '../components/reactAgenda'
import ReactAgendaCtrl from '../components/reactAgendaCtrl'
import Modal from '../components/Modal/Modal'
import axios from 'axios'
import {baseApiUrl} from '../global'
import './Agenda.css'
import { Link } from 'react-router-dom'
import { FaPlay, FaPause, FaWpforms } from 'react-icons/fa'



var now = new Date();

require('moment/locale/pt-br.js');
    var colors= {
      "color-1":"rgba(102, 195, 131 , 1)",
      "color-2":"rgba(242, 177, 52, 1)",
      "color-3":"rgba(235, 85, 59, 1)",
      "color-4":"rgba(70, 159, 213, 1)",
      "color-5":"rgba(170, 59, 123, 1)"
    }

export default class Agenda extends Component {
  constructor(props){
  super(props);

this.state = {
    salas:[],
    selectedSala: null,
    pessoas:[],
    items:[],
    selected:[],
    cellHeight:15,
    showModal:false,
    locale:"pt-br",
    rowsPerHour:4,
    numberOfDays:5,
    startDate: new Date(),
    playing:false
}
this.handleRangeSelection = this.handleRangeSelection.bind(this)
this.handleItemEdit = this.handleItemEdit.bind(this)
this.zoomIn = this.zoomIn.bind(this)
this.zoomOut = this.zoomOut.bind(this)
this._openModal = this._openModal.bind(this)
this._closeModal = this._closeModal.bind(this)
this.addNewEvent = this.addNewEvent.bind(this)
this.removeEvent = this.removeEvent.bind(this)
this.editEvent = this.editEvent.bind(this)
this.changeView = this.changeView.bind(this)
this.handleCellSelection = this.handleCellSelection.bind(this)
this.handleChange = this.handleChange.bind(this)
this.handlePlay = this.handlePlay.bind(this)
this.play = this.play.bind(this)
  }

getSalas = async () => {
    try {
        const resSalas = await axios.get(`${baseApiUrl}/salas`)
        this.setState({ salas: resSalas.data })
        this.setState({ selectedSala: resSalas.data[1].id })

    } catch (err) {
        alert(err)
    }
}

getPessoas = async () => {
    try {
        const resPessoas = await axios.get(`${baseApiUrl}/pessoas`)
        this.setState({ pessoas: resPessoas.data })
    } catch (err) {
        alert(err)
    }
}

getAgendamentos = async () => {
    try {
        const resAgendamentos = await axios.get(`${baseApiUrl}/salas/${this.state.selectedSala}/agendamentos`)
        let formattedItems = Array.from(resAgendamentos.data).map( (agendamento) => {
            const pessoa = this.state.pessoas.filter((pessoa) => pessoa.id == agendamento.idpessoa)
          return {
            _id: agendamento.id,
            name: agendamento.descricao,
            idpessoa: agendamento.idpessoa,
            nomepessoa: pessoa[0]? pessoa[0].nome : '',
            idsala: agendamento.idsala,
            startDateTime : new Date(agendamento.datahoraini),
            endDateTime   : new Date(agendamento.datahorafim),
            classes: agendamento.sglcor
          }
        })
        this.setState({ items: formattedItems })
        
    } catch (err) {
        alert(err)
    }
}

deleteAgendamento = async (id) => {
    try {
      await axios.delete(`${baseApiUrl}/agendamentos/${id}`)
      
  } catch (err) {
      alert(err)
  }
}

componentDidMount= async () => {
    this.getPessoas()
    await this.getSalas()
    this.getAgendamentos()
  } 

componentWillReceiveProps(next , last){
  if(next.items){
    this.setState({items:next.items})
  }
}

  handleItemEdit(item, openModal) {
    if(item && openModal === true){
      this.setState({selected:[item] })
      return this._openModal();
    }

  }
  handleCellSelection(item, openModal) {

    if(this.state.selected && this.state.selected[0] === item){
      return  this._openModal();
    }
       this.setState({selected:[item] })

  }

  zoomIn(){
var num = this.state.cellHeight + 15
    this.setState({cellHeight:num})
  }
  zoomOut(){
var num = this.state.cellHeight - 15
    this.setState({cellHeight:num})
  }


  handleChange(event) {
    if(event.target.tagName === 'BUTTON'){
      event.preventDefault();
    }

    var data = this.state;
    data[event.target.name] = event.target.value;

    this.setState(data)

    if(event.target.name === 'selectedSala') {
      this.getAgendamentos()
    }
  }

  handleDateRangeChange (startDate, endDate) {
      this.setState({startDate:startDate })

  }

  handleRangeSelection (selected) {
    this.setState({selected:selected , showCtrl:true})
    this._openModal()
    }

_openModal(){
  this.setState({showModal:true})
}
_closeModal(e){
  if(e){
    e.stopPropagation();
    e.preventDefault();
  }
    this.setState({showModal:false})
}

handleItemChange(items , item){

this.setState({items:items})
}

handleItemSize(items , item){

  this.setState({items:items})

}

removeEvent(items , item){
  this.deleteAgendamento(item._id)
  this.setState({ items:items});
}

addNewEvent (){

  this.setState({showModal:false ,selected:[]});
  this.getAgendamentos()
  this._closeModal();
}

editEvent (items){

  this.setState({showModal:false ,selected:[] , items:items});
  this.getAgendamentos()
  this._closeModal();
}

changeView (days){
this.setState({numberOfDays:days})
}

play(i) {
  if(this.state.playing){
  const qtdSalas = this.state.salas.length

  this.setState({selectedSala: this.state.salas[i].id}, () => this.getAgendamentos())
  if (i == qtdSalas - 1) {
    i = 0 
  } else {
    i++
  }
  setTimeout(() => this.play(i), 10000)
}
}

handlePlay() {
  this.setState(
    prevState => ({playing: !prevState.playing}), () => {this.play(0)}
  )
}

  render() {
    return (

      <div className="content-expanded ">

        <div className="control-buttons">
            <button  className="button-control" onClick={this._openModal}> <i className="schedule-icon"></i> </button>
            <button  className="button-control" onClick={this.zoomIn}> <i className="zoom-plus-icon"></i> </button>
            <button  className="button-control" onClick={this.zoomOut}> <i className="zoom-minus-icon"></i> </button>
            <button  className="button-control" onClick={this.changeView.bind(null , 7)}> {moment.duration(7, "days").humanize()}  </button>
            <button  className="button-control" onClick={this.changeView.bind(null , 5)}> {moment.duration(5, "days").humanize()}  </button>
            <button  className="button-control" onClick={this.changeView.bind(null , 1)}> {moment.duration(1, "day").humanize()} </button>
            <div className="border-left px-2 pt-2 pt-sm-1" onClick={() => this.handlePlay()}>{this.state.playing?<FaPause/>:<FaPlay/>}</div>
            <select className="w-100 font-weight-bold text-uppercase " name="selectedSala" value={this.state.selectedSala} onChange={this.handleChange.bind(this)}>
                {this.state.salas.map((sala,i) => <option key={i} value={sala.id}>{sala.descricao}</option>)}
            </select>
            <Link className="px-2 pt-2 pt-sm-1" to="/cadastro"><FaWpforms/></Link> 
        </div>

        <ReactAgenda
          minDate={new Date(now.getFullYear(), now.getMonth()-3)}
          maxDate={new Date(now.getFullYear(), now.getMonth()+3)}
          startDate={this.state.startDate}
          startAtTime={6}
          endAtTime={23}
          cellHeight={this.state.cellHeight}
          locale="pt-br"
          items={this.state.items}
          numberOfDays={this.state.numberOfDays}
          headFormat={"dddd DD MMM"}
          rowsPerHour={this.state.rowsPerHour}
          itemColors={colors}
          helper={true}
          //itemComponent={<AgendaItem/>}
          view="calendar"
          autoScale={false}
          fixedHeader={true}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
          onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onDateRangeChange={this.handleDateRangeChange.bind(this)} />
        {
          this.state.showModal? <Modal clickOutside={this._closeModal} >
          <div className="modal-content">
             <ReactAgendaCtrl items={this.state.items} itemColors={colors} selectedCells={this.state.selected} Addnew={this.addNewEvent} edit={this.editEvent} pessoaList={this.state.pessoas} selectedSala={this.state.selectedSala}/>
          </div>
   </Modal>:''
}


       </div>

    );
  }
}
