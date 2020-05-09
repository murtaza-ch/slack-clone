import React, { Component, Fragment } from 'react'
import {Segment,Comment} from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import '../../App.css';
import firebase from '../../Firebase';
import Message from './Message';
import {setUserPosts} from '../../actions/User';
import {connect} from 'react-redux';
import Typing from './Typing';
import Skeleton from './Skeleton';


class Messages extends Component {

    state={
        privateChannel:this.props.isPrivateChannel,
        privateMessagesRef:firebase.database().ref('privateMessages'),
        messagesRef:firebase.database().ref('messages'),
        messages:[],
        messagesLoading:true,
        channel:this.props.currentChannel,
        isChannelStarred:false,
        user:this.props.currentUser,
        usersRef:firebase.database().ref('users'),
        numUniqueUsers:'',
        searchTerm:'',
        searchLoading:false,
        searchResults:[],
        typingRef:firebase.database().ref('typing'),
        typingUsers:[],
        connectedRef:firebase.database().ref('.info/connected'),
        listeners:[]
    }

    componentDidMount(){
        const {channel,user,listeners}=this.state;

        if (channel && user) {
            this.removeListeners(listeners)
            this.addListeners(channel.id);
            this.addUsersStarsListeners(channel.id,user.uid);
            this.addTypingListeners(channel.id);
        }
    }

    componentWillUnmount(){
        this.removeListeners(this.state.listeners);
        this.state.connectedRef.off();
    }

    removeListeners=(listeners)=>{
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event)
        });
    }

    componentDidUpdate(prevProps,prevState){
        if (this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    addToListeners=(id,ref,event)=>{
        const index = this.state.listeners.findIndex((listener)=>{
            return listener.id === id && listener.ref === ref && listener.event === event;
        })

        if (index === -1) {
            const newListener={id,ref,event};
            this.setState({listeners:this.state.listeners.concat(newListener)});
        }
    }

    scrollToBottom=()=>{
        this.messagesEnd.scrollIntoView({behavior:'smooth'});
    }

    addTypingListeners=(channelId)=>{
        let typingUsers=[];

        this.state.typingRef
        .child(channelId)
        .on('child_added',snap=>{
            if (snap.key !== this.state.user.uid) {
                typingUsers=typingUsers.concat({
                    id:snap.key,
                    name:snap.val()
                })
                this.setState({typingUsers})
            }
        })

        this.addToListeners(channelId,this.state.typingRef,'child_added');

        this.state.typingRef
        .child(channelId)
        .on('child_removed',snap=>{
            const index=typingUsers.findIndex(user=>user.id === snap.key);
            if (index !== -1) {
                typingUsers=typingUsers.filter((user)=> user.id !== snap.key)
                this.setState({typingUsers});
            }
        })


        this.addToListeners(channelId,this.state.typingRef,'child_removed');


        this.state.connectedRef
        .on('value',snap=>{
            if (snap.val() === true) {
                this.state.typingRef
                .child(channelId)
                .child(this.state.user.uid)
                .onDisconnect()
                .remove((err)=>{
                    if (err !== null) {
                        console.error(err);
                        
                    }
                })
            }
        })

    }

    addListeners=(channelId)=>{
        let loadedMessage=[];
        const ref=this.getMessagesRef();
        ref.child(channelId).on('child_added',(snap)=>{
            loadedMessage.push(snap.val());
            this.setState({
                messages:loadedMessage,
                messagesLoading:false
            })
            this.countUniqueUsers(loadedMessage);
            this.countUserPosts(loadedMessage);
        })
        this.addToListeners(channelId,ref,'child_added');
    }

    addUsersStarsListeners=(channelId,userId)=>{
        this.state.usersRef
        .child(userId)
        .child('starred')
        .once('value')
        .then((data)=>{
            if (data.val() !== null) {
                const channelIds=Object.keys(data.val());
                const prevStarred=channelIds.includes(channelId);
                this.setState({isChannelStarred:prevStarred});
            }
        })
    }


    getMessagesRef=()=>{
        const {messagesRef,privateMessagesRef,privateChannel}=this.state;
        return privateChannel ? privateMessagesRef:messagesRef;
    }

    handleStar=()=>{
        this.setState((prevState)=>({
            isChannelStarred:!prevState.isChannelStarred
        }),()=>this.starChannel());
    }

    starChannel=()=>{
        if (this.state.isChannelStarred) {
            this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .update({
                [this.state.channel.id]:{
                    name:this.state.channel.name,
                    details:this.state.channel.details,
                    createdBy:{
                        name:this.state.channel.createdBy.name,
                        avatar:this.state.channel.createdBy.avatar
                    }
                }
            })
            
        }
        else{
            
            this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove((err)=>{
                if (err !== null) {
                    console.error(err);
                    
                }
            })

            
        }
    }


    handleSearchChange=(e)=>{
        this.setState({
            searchTerm:e.target.value,
            searchLoading:true
        },()=>{
            this.handleSearchMessages();
        })
    }

    handleSearchMessages=()=>{
        const channelMessages=[...this.state.messages];
        const regex=RegExp(this.state.searchTerm,'gi');
        const searchResults=channelMessages.reduce((acc,message)=>{
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);   
            }
            return acc;
        },[]);
        this.setState({searchResults});
        setTimeout(() => {
            this.setState({searchLoading:false})
        }, 1000);
    }

    countUniqueUsers=(messages)=>{
        const uniqueUsers=messages.reduce((acc,message)=>{
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        },[])

        const plural=uniqueUsers.length > 1 || uniqueUsers.length === 0;

        const numUniqueUsers=`${uniqueUsers.length} user${plural ? 's': ''} `;

        this.setState({numUniqueUsers});
    }


    countUserPosts=(messages)=>{
        let userPosts=messages.reduce((acc,message)=>{

            if (message.user.name in acc) {
                acc[message.user.name].count +=1;
            }
            else{
                acc[message.user.name]={
                    avatar:message.user.avatar,
                    count:1
                }
            }
            return acc;
        },{});
        this.props.setUserPosts(userPosts);
        
    }

    displayMessages=(messages)=>{

        return(
            messages.length > 0 && (
                messages.map((message)=>{
                    return(
                        <Message key={message.timestamp} user={this.state.user} message={message}/>
                    )
                })
            )
        )
    }

    displayChannelName=(channel)=>{
        return channel ? `${this.state.privateChannel ? '@' :'#'}${channel.name}`: '';
    }


    displayTypingUsers=(users)=>{
        users.length > 0 && users.map((user)=>(
            <div style={{display:'flex',alignItems:'center' ,marginBottom:'0.2em'}} key={user.id}>
                <span className="user__typing">{user.name} is typing</span>
                <Typing/>
            </div>
        ))
    }

    displayMessagesSkeleton=(loading)=>{
    return(
        loading ? (
            <Fragment>
                {[...Array(10)].map((_ ,i)=>(
                    <Skeleton key={i}/>
                ))}
            </Fragment>
        ):null
    )
}

    render() {
        const {messagesRef,
            messages,
            channel,
            user,
            numUniqueUsers,
            searchTerm,
            searchResults,
            searchLoading,privateChannel,isChannelStarred,typingUsers,messagesLoading}=this.state
        return (
            <Fragment>
                <MessagesHeader
                channelName={this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={privateChannel}
                handleStar={this.handleStar}
                isChannelStarred={isChannelStarred}
                />
                <Segment>
                    <Comment.Group className='messages'>

                        {this.displayMessagesSkeleton(messagesLoading)}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}

                        {this.displayTypingUsers(typingUsers)}

                        <div ref={node => (this.messagesEnd = node)}></div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}
                isPrivateChannel={privateChannel}
                getMessagesRef={this.getMessagesRef}
                />
            </Fragment>
        )
    }
}

export default connect(null,{setUserPosts})(Messages);