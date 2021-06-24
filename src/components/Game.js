import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Button } from 'react-native';

import RandomNumber from './RandomNumber';

class Game extends React.Component {
    static propTypes = {
        randomNumberCount : PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
    }

    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    };
    
    randomNumbers = Array.from({length: this.props.randomNumberCount})
                    .map(() => 1 + Math.floor(10 * Math.random()));

    target = this.randomNumbers.
                    slice(0, this.props.randomNumberCount - 2)
                    .reduce((acc, curr) => acc + curr, 0);

                    

    gameStatus = 'PLAYING';

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState((prevState) => {
                return { remainingSeconds: prevState.remainingSeconds - 1};
            }, () => {
                if(this.state.remainingSeconds === 0){
                    clearInterval(this.intervalId);
                }
            });
        }, 1000);
    }

    getSnapshotBeforeUpdate(nextProps, nextState){
        if(nextState.selectedIds !== this.state.selectedIds ||
            nextState.remainingSeconds === 0){
                this.gameStatus = this.calcGameStatus(nextState);
                console.log(this.gameStatus);
                if(this.gameStatus !== 'PLAYING'){
                    clearInterval(this.intervalId);
                }
            }
        return null;
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }


    isNumberSelected = (numberIndex) =>{
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    };

    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
             selectedIds: [...prevState.selectedIds, numberIndex],   
        }));
    };

    calcGameStatus = (nextState) => {
        //console.log("calc..");
        const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
            return acc + this.randomNumbers[curr];
        }, 0);
        //console.log(sumSelected);
        //console.log(this.target);
        if(nextState.remainingSeconds === 0){
            return 'LOST';
        }
        
        //console.log(sumSelected);
        if(sumSelected < this.target){
            return 'PLAYING';
        }
        if(sumSelected === this.target){
            return 'WON';
        }
        if(sumSelected >this.target){
            return 'LOST';
        }

    }

    render(){
        this.gameStatus = this.calcGameStatus(this.state);
        console.log('STATUS_' + this.gameStatus);
        return(      
            <View style={styles.container}>
                <Text style={[styles.target, styles['STATUS_' + this.gameStatus]]}>{this.target}</Text>
                <View style={styles.randomContainer}>
                    {this.randomNumbers.map((randomNumber, index) => 
                        //<Text style={styles.random} key={index}>{randomNumber}</Text>
                        <RandomNumber 
                        key={index} 
                        id={index}
                        number={randomNumber}
                        isDisabled={this.isNumberSelected(index) || this.gameStatus !== 'PLAYING'}  
                        onPress = {this.selectNumber}
                        />
                    )}
                </View>
                {this.gameStatus !== 'PLAYING' && 
                    <Button title="Play Again" onPress={this.props.onPlayAgain} />
                }
                <Text>{this.state.remainingSeconds}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{       
        flex : 1,
        paddingTop: 30,
    },

    target:{
        fontSize: 50,
        backgroundColor: '#aaa',
        marginHorizontal: 50,
        textAlign: 'center',
    },

    randomContainer:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    STATUS_PLAYING:{
        backgroundColor : '#ddd',
    },

    STATUS_WON:{
        backgroundColor : 'green',
    },

    STATUS_LOST:{
        backgroundColor : 'red',
    },
});

export default Game;