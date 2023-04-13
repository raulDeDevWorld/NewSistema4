
// export default WithAuth(Admin)




import { handleSignOut, getData, removeData, writeUserData } from '../firebase/utils'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '../context/Context.js'
import { WithAuth } from '../HOCs/WithAuth'
import Modal from '../components/Modal'
import Error from '../components/Error'
import Button from '../components/Button'
import Layout from '../layout/Layout'

import { useEffect } from 'react'

import Success from '../components/Success'
import style from '../styles/AdminUsers.module.css'

function Users() {
    const { user, userDB, setUserData, setUserSuccess, success } = useUser()
    const [mode, setMode] = useState('')
    const [itemSelect, setItemSelect] = useState('')
    const [rol, setRol] = useState('')
    const [filter, setFilter] = useState('')

    const router = useRouter()

    function push(e) {
        e.preventDefault()
        router.push('/AddUser')
    }
    // function edit(item) {
    //     router.push(`/update/${item}`)
    // }
    function remove(item) {
        setMode('remove')
        setItemSelect(item)
    }
    function removeConfirm() {
            setItemSelect('')
            removeData(`users/${itemSelect}/`, setUserData, setUserSuccess)
            console.log('eli');
            getData(`/`, setUserData)
            console.log('admin');
    }

    function edit(item) {
        setRol(userDB.users[item].rol)
        setMode('edit')
        setItemSelect(item)
    }
    function editRol(data) {
        setRol(data)
    }
    function editConfirm() {
        writeUserData(`users/${itemSelect}/`, { rol, }, setUserSuccess)
        getData(`/`, setUserData)
    }

    function x() {
        setMode(null)
    }
    function signOut(e) {
        e.preventDefault()
        handleSignOut()
    }
    console.log(rol)
    function handlerOnChange(e) {
        // e.target.value
        setFilter(e.target.value)
    }



    useEffect(() => {
        userDB && userDB.users[user.uid] && userDB.users[user.uid].rol !== 'Admin' && router.push('/Formularios')
    }, [userDB, success])


    console.log(userDB)
    return (


        <Layout>
            <div className={style.container}>


                {userDB && userDB.users && <main className={style.main}>
                    <div className={style.containerIMG}>
                        <Image src="/logo.svg" width="350" height="250" alt="User" />
                    </div>               
                    <input className={style.filter} onChange={handlerOnChange} placeholder='Buscar Por Email' />

                    {userDB && userDB.users && <ul className={style.list}>
                        {Object.keys(userDB.users).map((item, i) => {
                            if (userDB.users[item].correo.includes(filter) && user.uid !== item) {
                                return <div className={style.items} key={i}>
                                    <Link href="#" >
                                        <a className={style.link}>{userDB.users[item].correo}</a>
                                    </Link>
                                    <div className={style.items}>
                                        <span className={style.rol}>{userDB.users[item].telefono}</span>

                                        <Image src="/Edit.svg" width="25" height="25" alt="User" onClick={() => edit(item)} />
                                        <Image src="/Delete.svg" width="25" height="25" alt="User" onClick={() => remove(item)} />
                                    </div>
                                </div>
                            }

                            if (filter == '' && user.uid !== item) {
                                return <div className={style.items} key={i}>
                                    <Link href="validator/[User]" as={`validator/${item}`} >
                                        <a className={style.link}>{userDB.users[item].email}</a>
                                    </Link>
                                    <div className={style.items}>
                                        <span className={style.rol}>{userDB.users[item].rol}</span>
                                        <Image src="/Edit.svg" width="25" height="25" alt="User" onClick={() => edit(item)} />
                                        <Image src="/Delete.svg" width="25" height="25" alt="User" onClick={() => remove(item)} />
                                    </div>
                                </div>
                            }
                        }
                        )}
                    </ul>}
                  
                </main>}
                {itemSelect !== '' && mode == 'remove' && <Modal mode={mode} click={x} confirm={removeConfirm} text={`Estas por eliminar a: ${userDB.users[itemSelect].correo}`}></Modal>}
                {itemSelect !== '' && mode == 'edit' && <Modal mode={mode} click={x} confirm={editConfirm} text={`Asignar un rol a: ${userDB.users[itemSelect].email}`}>
                  









                    <Button style={rol == 'AdmSe' ? 'buttonPrimary' : 'buttonSecondary'} click={() => editRol('AdmSe')}>Admin Sec</Button>
                </Modal>}
                {success == 'save' && <Success>Correcto</Success>}
                {success == 'repeat' && <Error>Verifica e intenta de nuevo</Error>}
            </div>
        </Layout>
    )
}

export default WithAuth(Users) 