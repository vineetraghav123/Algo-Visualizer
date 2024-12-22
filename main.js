
// selectionSort()
var skyblue = "#add8e6";
var green = "green";
var orange = "orange";
var red = "red";
var sorted = "#48B648";
// var stopSorting = false;

var time = 100;

function setTime() {
  var slider = document.getElementById("timerange");
  console.log(slider.value);
  this.time = parseInt(slider.value) || 500;
  this.time = 1050 - this.time;
}

function changeBars() {
  // location.reload();
  addBars();
}

function addBars() {

  var minBarWt = 55;
  var slider = document.getElementById("elements");
  var barcanvas = document.getElementById("barcanvas");
  // barcanvas.childNodes.forEach(c=>{
  //   barcanvas.removeChild(c);
  // });
  barcanvas.innerHTML = '';
  var width = barcanvas.clientWidth;
  var bars = parseInt(slider.value) || 15;
  var count = bars;

  for (let i = 0; i < count; i++) {

    var z = document.createElement('div'); // is a node
    z.style.height = `${Math.trunc(Math.random() * 80 + 20) * 2}px`
    z.classList.add("bar");

    var computedWidth = Math.trunc(width / bars) - 4;
    if (computedWidth > minBarWt) {
      computedWidth = minBarWt
    }
    z.style.width = `${computedWidth}px`;
    z.style.fontSize = `${parseInt((computedWidth * 55) / 100)}px`
    z.innerHTML = parseInt(z.style.height);
    // z.innerHTML = 'bar';

    barcanvas.appendChild(z);
  }
}
var oscillatorCpy = null
var audioCtx = null
window.onload = function () {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  addBars()
  setTime()
  //  setTimeout(() => {
  //   for(let i=100;i<200;i++){
  //     sound(i);
  //   }
  //  }, 5000);
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function animate(collection, li, ri, diff, changeColor = true) {
  var liback = collection[li].style.backgroundColor;
  var riback = collection[li].style.backgroundColor;
  if (changeColor) {
    collection[li].style.backgroundColor = "orange";
    collection[ri].style.backgroundColor = "orange";
  }
  var left = parseInt(collection[li].style.height)
  var right = parseInt(collection[ri].style.height)
  // sound(left+right)

  console.log("time>>", time)
  return new Promise(resolve => {
    collection[li].animate(
      [
        // keyframes
        { transform: `translateX(${diff}px)` },
      ],
      {
        duration: time + 100,
        iterations: 1,
        easing: "ease-in-out"
      })
    var rightAni = collection[ri].animate(
      [
        // keyframes
        { transform: `translateX(-${diff}px)` },
      ],
      {
        duration: time + 100,
        iterations: 1,
        easing: "ease-in-out"
      })
    rightAni.onfinish = function () {
      if (changeColor) {
        collection[li].style.backgroundColor = liback;
        collection[ri].style.backgroundColor = riback;
      }
      collection[li].style.height = `${right}px`;
      collection[li].innerHTML = right
      collection[ri].style.height = `${left}px`;
      collection[ri].innerHTML = left
      resolve(true);
      // oscillatorCpy.stop()
    };

  });
}

async function sort(sortName) {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children
  // selectionSort(collection);
  // bubbleSort(collection);
}

async function bubbleSort() {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children
  var swap = true;

  // return
  for (let i = 0; i < collection.length; i++) {
    swap = false;
    for (let j = 0; j < collection.length - 1; j++) {
      var li = j;
      var ri = j + 1
      var left = parseInt(collection[li].style.height)
      var right = parseInt(collection[ri].style.height)
      var rectLi = collection[li].getBoundingClientRect();
      var rectRi = collection[ri].getBoundingClientRect();
      var diff = Math.trunc(Math.abs(rectLi.left - rectRi.left))

      if (left > right) {
        swap = true

        await animate(collection, li, ri, diff);


        // collection[li].style.height = `${right}px`
        // collection[ri].style.height = `${left}px`;

        await sleep(time)
      } else {
        sound(left + right)
        collection[li].style.backgroundColor = "blue";
        collection[ri].style.backgroundColor = "blue";
        await sleep(time)
        oscillatorCpy.stop()
      }
      collection[li].style.backgroundColor = "#48B648";
      collection[ri].style.backgroundColor = "#48B648";
    }
    if (!swap) {
      break;
    }
  }

}

async function selectionSort(collection) {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children
  var i, j, min_idx, min_ht;

  // One by one move boundary of unsorted subarray 
  for (i = 0; i < collection.length; i++) {
    collection[i].style.backgroundColor = "#89c3d6";
    // Find the minimum element in unsorted array 
    min_ht = parseInt(collection[i].style.height);
    min_idx = i;

    for (j = i + 1; j < collection.length; j++) {
      collection[j].style.backgroundColor = "blue";
      var curr = parseInt(collection[j].style.height)
      sound(curr + 50)
      if (curr < min_ht) {
        if (min_idx != i) {
          collection[min_idx].style.backgroundColor = skyblue;
        }
        min_idx = j;
        min_ht = curr;

        collection[min_idx].style.backgroundColor = "red";
      }
      await sleep(time);
      oscillatorCpy.stop()

      if (j != min_idx) {
        collection[j].style.backgroundColor = skyblue;
      }
    }


    var rectLi = collection[i].getBoundingClientRect();
    var rectRi = collection[min_idx].getBoundingClientRect();
    var diff = Math.trunc(Math.abs(rectLi.left - rectRi.left));
    if (min_idx == i) {
      collection[i].style.backgroundColor = sorted;
    } else {
      await animate(collection, i, min_idx, diff);
      collection[i].style.backgroundColor = sorted;
      collection[min_idx].style.backgroundColor = skyblue;
    }
    await sleep(time)

    // Swap the found minimum element with the first element 
    // swap(arr, min_idx, i);
  }
}


function sound(frequency) {
  // create web audio api context

  // create Oscillator node
  var oscillator = audioCtx.createOscillator();
  oscillatorCpy = oscillator

  oscillator.type = 'square';
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  // oscillator.stop();

}

function getHeight(i) {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children;
  return parseInt(collection[i].style.height);
}
function getDiff(i, j) {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children;
  var rectLi = collection[i].getBoundingClientRect();
  var rectRi = collection[j].getBoundingClientRect();
  var diff = Math.trunc(Math.abs(rectLi.left - rectRi.left))
  return diff;
}

async function quick() {
  var barcanvas = document.getElementById("barcanvas");
  var collection = barcanvas.children;

  async function partition(arr, low, high) {
    for (let i = low; i <= high; i++) {
      collection[i].style.backgroundColor = "yellow";
      // collection[i].style.marginTop="100px"

    }

    collection[high].style.backgroundColor = "blue";
    const pivot = getHeight(high);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      var l = getHeight(j);
      sound(l + pivot)
      if (l <= pivot) {
        i++;
        // Swap arr[i] and arr[j]
        // [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i != j) {
          await animate(collection, i, j, getDiff(i, j), true);
        }
        await sleep(time);
        oscillatorCpy.stop()
      }
    }

    // Swap arr[i+1] and arr[high] (or pivot)
    // [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    await animate(collection, i + 1, high, getDiff(i + 1, high), true);
    for (let i = low; i <= high; i++) {
      collection[i].style.backgroundColor = "#add8e6";
    }
    return i + 1;
  }

  async function partition1(arr, low, high) {
    var pivot = getHeight(high);
    var i = low;
    var j = high - 1;
    while (i < j) {
      var li = getHeight(i);
      while (li <= pivot && i < j) {
        i++;
        li = getHeight(i);
      }

      var ri = getHeight(j);
      while (ri > pivot && i < j) {
        j--;
        ri = getHeight(j);
      }

      if (i <= j) {
        await animate(collection, i, j, getDiff(i, j));
        await sleep(time);
        i++;
        j--;
      }

    }
    if (i < j) {
      await animate(collection, i, high, getDiff(i, high));
    }
    await sleep(time);

    // vi
    return i

  }


  async function quickSort(arr, low, high) {

    if (low >= high) return;
    let pi = await partition(arr, low, high);
    collection[pi].style.backgroundColor = "blue";

    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
    collection[pi].style.backgroundColor = skyblue;

    for (let i = low; i <= high; i++) {
      collection[i].style.backgroundColor = green;
    }
  }
  quickSort(collection, 0, collection.length - 1);

}
