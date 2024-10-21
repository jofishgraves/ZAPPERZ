"use strict"

/*
 * A class to define the 2D canvas
 */
class Canvas
{
    //Properites
    #context
    #width
    #canvas
    #height

    /*
     * The constructor for the canvas
     */
    constructor(canvasId, w, h)
    {

        this.#width = w
        this.#height = h

        //Canvas properities
        this.#canvas = document.createElement("canvas")
        this.#canvas.height = h
        this.#canvas.width = w
        this.#canvas.style = "border: 1px solid black;"

        //Is needed to allow key press events
        this.#canvas.tabIndex = 0;

        let location = document.getElementById(canvasId)
        location.appendChild(this.#canvas)
        
        this.#context = this.#canvas.getContext("2d")
    }

    //Methods
    Clear()
    {
        this.#context.clearRect(0, 0, this.#width, this.#height)
    }

    /*
     * Sets a pixel on the screen
     */
    SetPixel(x, y, r, g, b)
    {
        this.#context.beginPath()
        this.#context.strokeStyle = 'rgb('+ r +','+ g +','+ b +')'
        this.#context.strokeRect = (x,y,1,1)
        this.#context.fillStyle = 'rgb('+ r +','+ g +','+ b +')'
        this.#context.fillRect(x,y,1,1)
    }

    /*
    * Draws a line on the screen
    */
    DrawLine(x0,y0,x1,y1)
    {
        this.#context.lineWidth = 15
        this.#context.beginPath();
        this.#context.strokeStyle = "rgb(0,255,0)";
        this.#context.moveTo(x0,y0);
        this.#context.lineTo(x1,y1);
        this.#context.stroke();
    }

    DrawBackground()
    {
        this.#context.lineWidth = 500
        this.#context.beginPath();
        this.#context.strokeStyle = "rgb(1,35,56)";
        this.#context.moveTo(0,250);
        this.#context.lineTo(700,250);
        this.#context.stroke();
    }
    
    /*
    * Adds an event listener to the canvas element
    */
    AddListener(event, call)
    {
        this.#canvas.addEventListener(event, call)
    }

    ///Get and set values
    get Width()
    {
        return this.#width
    }

    set Width(value)
    {
        this.#width = value
    }

    get Height()
    {
        return this.#height
    }

    set Height(value)
    {
        this.#height = value
    }

}