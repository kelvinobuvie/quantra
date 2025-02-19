import React, { Component } from 'react';

class BackgroundChanger extends Component {
  constructor(props) {
    super(props);
    this.images = [
      '/Wallet.jpg',  
      '/cypto.jpg',
      '/invest2.jpg'
    ];
    this.index = 0;
  }

  componentDidMount() {
    this.interval = setInterval(this.changeBackground, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeBackground = () => {
    document.querySelector('.background-container').style.backgroundImage = `url(${this.images[this.index]})`;
    this.index = (this.index + 1) % this.images.length;
  };

  render() {
    return (
      <div className="background-container flex flex-col gap-3 justify-center items-center  bg-gray-300 p-12">
          <h1 className='text-white font-light text-5xl z-1000 border-b-8 border-orange-600 px-2 py-2'>
            <span className='font-medium text-blue-950'>quantra</span>
          </h1>
          <p className='text-lg flex text-center text-white'>Empower your finances effortlessly: set goals, track spending, and lock in savings with a smart dashboard that keeps you on target and helps build better financial habits</p>
      </div>
    );
  }
}

export default BackgroundChanger;
