import React from 'react';
import { StyleSheet, View } from 'react-native';
import Game from './Game';

class App extends React.Component {
    state = {
        gameId: 1,
    }

    resetGame = () => {
        this.setState((prevState) => {
            return { gameId: prevState.gameId + 1};
        });
    };

    render(){
        return(
            <Game key={this.state.gameId}
            onPlayAgain={this.resetGame}
            randomNumberCount = {6} 
            initialSeconds={10}/>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor : '#ddd',
        flex : 1
    },

});

export default App;