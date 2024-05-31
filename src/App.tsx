import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Avatar, Badge, Box, Button, InputAdornment, MenuItem, Modal, TextField, Tooltip } from '@mui/material';
import { Notifications, Edit, Delete, Add, Search, Rocket, RocketLaunch } from '@mui/icons-material';

const currencies = [
  {
    value: 'normal',
    label: 'Entrega Normal',
  },
  {
    value: 'turbo',
    label: 'Entrega Turbo',
  },
];

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'grid',
  gap: '20px'

};

type TileProps = {
  id: any;
  type: string;
  address: string;
  desc: string;
  number: string;
  setModal: () => any;
  setModalDelete: () => any;
};

const Tile = (props: TileProps) => {
  return (
    <div className="Tile">
          <div className="NameType">
            {props.type == 'turbo' ? (<Tooltip title="Entrega Turbo"><RocketLaunch style={{color: "#924737"}} /></Tooltip>) : (<Tooltip title="Entrega normal"><Rocket style={{color: "#924737"}} /></Tooltip>)}  
            <div>
              {props.address}
            </div>
          </div>  
          <div className="Desc">
            {props.desc}
          </div>  
          <div className="Number">    
            {props.number}
          </div>
          <div className="EditDelete">
            <div onClick={() => props.setModal()} className='Button Right'>
            <Edit style={{color: "#924737"}} /> Editar  
            </div>
            <div onClick={() => props.setModalDelete()} className='Button Left'>
            <Delete style={{color: "#924737"}} /> Deletar  
            </div>
          </div>
        </div>
  )
}

function App() {
  const [index, setIndex] = useState<any>([])
  const [modal, setModal] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [editValue, setEditValue] = useState<any>({})
  const [newValue, setNewValue] = useState<any>({})
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    // Atualiza o título do documento usando a API do browser
    let newIndex = []
    const retrievedObject = localStorage.getItem('AddressObject');
    if (retrievedObject){
      newIndex = JSON.parse(retrievedObject)
    }
    setIndex(newIndex )
  });

  function SaveEdit () {
    let newIndex = [] 
    const retrievedObject = localStorage.getItem('AddressObject');
    if (retrievedObject){
      newIndex = JSON.parse(retrievedObject)
    }    
    newIndex.splice(editValue.id - 1, 1, editValue);
    localStorage.setItem('AddressObject', JSON.stringify(newIndex));
    CloseModal()
  }

  function SaveNew () {
    let newIndex = []
    const retrievedObject = localStorage.getItem('AddressObject');
    if (retrievedObject){
      newIndex = JSON.parse(retrievedObject)
    }
    newIndex.push(newValue)
    localStorage.setItem('AddressObject', JSON.stringify(newIndex));
    CloseModal()
  }

  function CreateMode () {
    var newId = index.length + 1
    setNewValue({...newValue, id: newId})
    setModal(true)
  }

  function EditMode (id: number) {
    const edit = index.find((tile: any)  => tile.id == id)
    setEditValue(edit ? edit : {})
    setModal(true)
  
    return null
  } 

  function CloseModal () {
    setEditValue({})
    setNewValue({})
    setModal(false)
    return null
  }

  return (
    <>  
    <div className="Header">
      <div>
        <img style={{maxHeight: '64px', maxWidth: '64px'}} src={logo} className="App-logo" alt="logo" />
      </div>
      <div />
      <div className='User'>
        <Badge badgeContent={4} style={{color: "#fff"}}>
        <div className='Notify'   >
          <Notifications style={{color: "#fff"}} />
        </div>
        </Badge>
        <Avatar style={{height: '34px', width: '34px'}} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </div>
    </div>


    <div className="App">
      <div className="Search">
        <TextField
            hiddenLabel
            id="filled-hidden-label-normal"
            defaultValue=""
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value) }
            fullWidth
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <div >
            <Button onClick={() => CreateMode()} style={{height: '56px', width: '56px', color: "#924737", borderColor: "#924737"}} variant="outlined"><Add /></Button>
          </div>
      </div>
      { (searchValue && index.filter((serchTile: any) => serchTile.address.toLowerCase().includes(searchValue.toLowerCase())).length <= 0) || index.length <= 0 ? (
        <div className="NoTiles">
          Sem entregas para mostrar
        </div>
        ) : searchValue ? (
        <div className="Tiles">
        {index.filter((serchTile: any) => serchTile.address.toLowerCase().includes(searchValue.toLowerCase())).map((tile: any) => (
          <Tile id={tile.id} type={tile.type} address={tile.address} desc={tile.desc} number={tile.number} setModal={() => EditMode(tile.id)} setModalDelete={() => setModalDelete(true)}/>
        ))}
      </div>
      ) : (<div className="Tiles">
      {index.map((tile: any) => (
        <Tile id={tile.id} type={tile.type} address={tile.address} desc={tile.desc} number={tile.number} setModal={() => EditMode(tile.id)} setModalDelete={() => setModalDelete(true)} />
      ))}
    </div>)}
    </div>
    <Modal
        open={modal}
        onClose={() => CloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='ModalHeader'>
            {Object.keys(editValue).length > 1 ? 'Editar Entrega' : 'Nova Entrega'}  
          </div>
          <div className='ModalBody'>
              <TextField
              id="outlined-select-currency"
              select
              value={Object.keys(editValue).length > 1 || editValue.type ? editValue.type : newValue.type ? newValue.type : ''}
              onChange={Object.keys(editValue).length > 1 ? (e) => setEditValue({...editValue, type:  e.target.value}) : (e) => setNewValue({...newValue, type:  e.target.value})}
              label="Tipo de Entrega"
              defaultValue=""
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              onChange={Object.keys(editValue).length > 1 ? (e) => setEditValue({...editValue, address  :  e.target.value}) : (e) => setNewValue({...newValue, address:  e.target.value})}
              id="outlined-required"  
              label="Digitos de Localização"
              inputProps={{ maxLength: 4 }}
              defaultValue={Object.keys(editValue).length > 1 || editValue.address ? editValue.address : newValue.address ? newValue.address : ''} 
              fullWidth
            />
            <TextField
              required
              onChange={Object.keys(editValue).length > 1 ? (e) => setEditValue({...editValue, desc:  e.target.value}) : (e) => setNewValue({...newValue, desc:  e.target.value})}
              id="outlined-required"  
              label="Descrição do Objeto"
              defaultValue={Object.keys(editValue).length > 1 || editValue.desc ? editValue.desc : newValue.desc ? newValue.desc : ''} 
              fullWidth
              multiline
              maxRows={4}
            />
            <TextField
              required
              onChange={Object.keys(editValue).length > 1 ? (e) => setEditValue({...editValue, number:  e.target.value}) : (e) => setNewValue({...newValue, number:  e.target.value})}
              id="outlined-required"  
              label="Numero de Contato"
              inputProps={{ maxLength: 12 }}
              defaultValue={Object.keys(editValue).length > 1 || editValue.number ? editValue.number : newValue.number ? newValue.number : ''} 
              fullWidth 
            />
          </div>
          <div>
            <Button onClick={Object.keys(editValue).length > 1 ? () => SaveEdit() :() => SaveNew()} variant="outlined" fullWidth>{Object.keys(editValue).length > 1 ? 'Salvar Edição ' : 'Salvar Entrega'}  </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          No momento não é possivel deletar a Entrega,
          tente novamente mais tarde
        </Box>
      </Modal>
    </>
  );
}

export default App;
