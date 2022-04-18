// ** Third Party Components
//import PropTypes from "prop-types"

import React, { useState, useEffect, Fragment } from "react"

// ** Services
import { connectContract } from "@src/services/logic"

// ** Reactstrap Imports
import { Card, Col, CardBody, CardTitle, CardText, Button } from "reactstrap"

const WalletConnect = () => {
    // ** Props
    //const { title, children, noBody, code, iconCode } = props

    const [currentAccount, setCurrentAccount] = useState(null)

    const checkWalletIsConnected = async () => {
        if (!ethereum) {
            alert("Make sure you have Metamask installed!")
        }

        const accounts = await ethereum.request({ method: "eth_accounts" })
        const chainId = await ethereum.request({ method: 'eth_chainId' })

        if (chainId !== '0x63564c40') {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x63564c40' }]
          })
        }

        if (accounts.length !== 0) {
            const account = accounts[0]
            setCurrentAccount(account)
        }
    }

    const connectWalletHandler = async () => {
        if (!ethereum) {
            alert("Please install Metamask!")
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts"
            })
            setCurrentAccount(accounts[0])
            connectContract()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        checkWalletIsConnected()
    }, [])

    return (
        <Col md='4' xl='3'>
            <Card className='bg-transparent border-primary shadow-none'>
                <CardBody>
                    <CardTitle tag='h4'>Connect Your Wallet</CardTitle>
                    <CardText>
                        In order to use this app, you need to connect your wallet to the Harmony network.
                    </CardText>
                    <CardText>
                        {currentAccount ? (
                            <Button.Ripple color='primary' outline>
                                Wallet Connected
                            </Button.Ripple>
                        ) : (
                            <Button.Ripple
                                color='primary'
                                outline
                                onClick={connectWalletHandler}
                            >
                                Connect Wallet
                            </Button.Ripple>
                        )}
                    </CardText>
                </CardBody>
            </Card>
        </Col>
    )
}

export default WalletConnect

// ** PropTypes
// CardSnippet.propTypes = {
//     code: PropTypes.node,
//     noBody: PropTypes.bool,
//     children: PropTypes.any,
//     iconCode: PropTypes.node,
//     className: PropTypes.string,
//     title: PropTypes.string.isRequired
// }
