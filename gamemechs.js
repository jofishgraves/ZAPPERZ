"use strict"

//Objects

/*
 * A base class for any moving object
 */
class Mover
{
    //Properities
    xpos
    ypos
    canvas

    //Constructor
    constructor(x,y,canvas)
    {
        this.xpos = x
        this.ypos = y
        this.canvas = canvas
    }

    //Methods
    Draw() {}
    Move() {}

    //Get properities
    get xpos()
    {
        return this.xpos
    }

    get ypos()
    {
        return this.ypos
    }
}

const RAND_MOVE_AMT = 10

/*
 * A class for the gun object
 */
class Gun extends Mover
{
    //Methods
    /**
     * Draws the gun to the screen
     * @param {*} aimAssist Checks if the user is using aim assist and draws a line corresponding to the path of the line
     */
    Draw(aimAssist)
    {
        if(aimAssist)
        {
            for(let x = 0; x < 2; x++)
                {
                    for(let y = 0; y < this.canvas.Height; y++)
                    {
                        this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,209,209)
                    }
                }
        }

        for(let x = -20; x < 21; x++) //Draws the x axis
        {
            for(let y = 0; y < 15; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-y, 104,65,210)
            }
        }

        for(let x = -8; x < 9; x++) //Draws the x axis
        {
            for(let y = 0; y < 15; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-(y*1.5), 104,65,210)
            }
        }
    }

    /*
     * Moves the gun depending on the key press
     */
    Move(key)
    {
        switch(key) //Determines which direction gun moves based on key press
        {
            case "a":
            case 'j':
            case 'ArrowLeft':
                if(this.xpos > 10)
                {
                    this.xpos -= 4
                }
                break
            case "l":
            case 'd':
            case 'ArrowRight':
                if(this.xpos < ZapCanvas.Width-10)
                {
                    this.xpos += 4
                }
        }
    }

    /**
     * Draws an animation if the ship is hit
     */
    Hit()
    {
        for(let x = -20; x < 21; x++) //Draws the x axis
        {
            for(let y = 0; y < 15; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,0,0)
            }
        }

        for(let x = -8; x < 9; x++) //Draws the x axis
        {
            for(let y = 0; y < 15; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-(y*1.5), 255,0,0)
            }
        }
    }
}

/**
 * A class for the shield object
 */
class Shield extends Mover
{
    //Properities
    health
    #stateR
    #stateG
    #stateB
    destroyed
    #max_y
    #max_x

    /*
     * Constructor for the Shield object
     */
    constructor(x,y,canvas)
    {
        super(x,y,canvas)
        this.health = 4
        this.#stateR = 3
        this.#stateG = 252
        this.#stateB = 236
        this.destroyed = false
        this.#max_y = y + 5
        this.#max_x = x + 30
    }

     /*
     *Draws a shield
     */
    Draw()
    {
        for(let x = -30; x < 31; x++) //Draws the x axis
        {
            for(let y = 0; y < 6; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-y, this.#stateR, this.#stateG, this.#stateB)
            }
        }
    }

    /*
     * Detects and set properities if the shield is hit
     */
    Hit()
    {
        if(this.health > 1)
        {
            this.health--
            
            switch(this.health)
            {
                case 3:
                    this.#stateR = 87
                    this.#stateG = 208
                    this.#stateB = 187
                    break;
                case 2:
                    this.#stateR = 171
                    this.#stateG = 164
                    this.#stateB = 138
                    break;
                case 1:
                    this.#stateR = 255
                    this.#stateG = 120
                    this.#stateB = 89
                    break;
            }
        }
        else
        {
            this.destroyed = true
            SetScore(-50)
        }
    }

    get max_x()
    {
        return this.#max_x
    }

    get max_y()
    {
        return this.#max_y
    }
}

/*
 * A class for the alien
 */
class Alien extends Mover
{
    //Properities
    #moveCase 
    #speed
    #shotsLeft
    #isAlive
    phase

    //constructor for the canvas
    constructor(x,y,canvas, p)
    {
        super(x,y,canvas)
        this.#moveCase = 0
        this.#speed = 0.5
        this.#shotsLeft = 4
        this.#isAlive = true
        this.phase = p
    }

    //Methods
    /*
     * Draws and animates an alien
     */
    Draw()
    {
        if(this.phase % 16 < 8)
        {
            for(let x = -12; x < 13; x++) //Draws the x axis
            {
                for(let y = 0; y < 24; y++) //Draws the y axis
                {
                
                    this.canvas.SetPixel(this.xpos+x, this.ypos-y, 0,255,0)
                }
            }
        }
        else if(this.phase % 16 >= 8)
        {
            for(let x = -9; x < 10; x++) //Draws the x axis
            {
                for(let y = 0; y < 18; y++) //Draws the y axis
                {
                
                    this.canvas.SetPixel(this.xpos+x, this.ypos-y, 0,255,0)
                }
            }
        }
    }

    /*
     * Moves the alien
     */
    Move(moveState) //move state determines the direction of the alien's movement
    {
        switch(moveState)
        {
            case "right":
                this.xpos += this.#speed //speed changes as more aliens die in game
                break
            case "left":
                this.xpos -= this.#speed
                break
            case "down":
                this.ypos += 10
                break;
            
        }

        this.phase++
    }

    /*
     * Draws the explosion of the alien
     */
    DrawExplode()
    {
        //Draws a red block to show that the alien is hit
        for(let x = -12; x < 13; x++) //Draws the x axis
        {
            for(let y = 0; y < 24; y++) //Draws the y axis
            {
                this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,0,0)
            }
        }

        //Draws the same block but with fragements
        for(let x = -13; x < 16; x++) //Draws the x axis
        {
            for(let y = 0; y < 30; y++) //Draws the y axis
            {
                if(x % 4 == 0)
                {
                    this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,0,0)
                }
                else
                {
                    this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,255,255)
                }
            }
        }

    }

    // Get and Set Properities
    get moveCase()
    {
        return this.#moveCase
    }

    set moveCase(value)
    {
        this.#moveCase = value
    }

    get shotsLeft()
    {
        return this.#shotsLeft
    }

    set shotsLeft(value)
    {
        this.#shotsLeft = value
    }

    get isAlive()
    {
        return this.#isAlive
    }

    set isAlive(value)
    {
        this.#isAlive = value
    }

    get speed()
    {
        return this.#speed
    }

    set speed(value)
    {
        this.#speed = value
    }
}

class Laser extends Mover
{
    shooter

    /*
     * Constructs the laser
     */
    constructor(x,y,canvas,shot)
    {
        super(x,y,canvas)
        this.shooter = shot
    }

    /*
     * Draws the laser of the screen
     */
    Draw()
    {
        switch(this.shooter)
        {
            case "gun":

                for(let x = 0; x < 2; x++) //Draws the x axis
                {
                    for(let y = 0; y < 20; y++) //Draws the y axis
                    {
                        this.canvas.SetPixel(this.xpos+x, this.ypos-y, 255,0,0)
                    }
                }
                
                break
            
                case "alien":

                    for(let x = 0; x < 2; x++) //Draws the x axis
                    {
                        for(let y = 0; y < 22; y++) //Draws the y axis
                        {
                            this.canvas.SetPixel(this.xpos+x, this.ypos+y, 252,135,2)
                        }
                    }
                    
                    break
        }
        
    }

    /*
     * Moves the laser
     */
    Move()
    {
        if(this.shooter == "gun")
        {
            this.ypos -= 32
        }
        else if(this.shooter == "alien")
        {
            this.ypos += 20
        }
    }

}

//Game Mech Functions

/*
 * Intializes the shields at the start of the game
 */
function MakeShield(dis)
{
    let x = dis //distance from each shield drawn
    let y = ZapCanvas.Height/1.15
    let shield = new Shield(x,y,ZapCanvas)
    return shield
}

/*
 * Draws the start screen, win and loss screen
 */
function DrawStartScreen(state)
{
    ZapCanvas.DrawBackground()

    //This loop draws the stars
    for(let x = 0; x < 700; x++) //Draws the x axis
    {
        for(let y = 0; y < 500; y++) //Draws the y axis
        {
            let rand = Math.floor(Math.random() * 500)

            if(rand % 500 == 4)
            {
                ZapCanvas.SetPixel(x, y, 255,255,255)
            }
        }
    }

    switch(state)
    {
        case "start":
            //Drawing Z
            ZapCanvas.DrawLine(50,100,149,100)
            ZapCanvas.DrawLine(143,103,50,200)
            ZapCanvas.DrawLine(45,200,150,200)

            //Drawing A
            ZapCanvas.DrawLine(200,90,180,210)
            ZapCanvas.DrawLine(200,90,230,210)
            ZapCanvas.DrawLine(190,150,220,150)

            //Drawing P
            ZapCanvas.DrawLine(260,90,260,210)
            ZapCanvas.DrawLine(259,95,300,120)
            ZapCanvas.DrawLine(259,140,300,115)

            //Drawing P
            ZapCanvas.DrawLine(320,90,320,210)
            ZapCanvas.DrawLine(319,95,360,120)
            ZapCanvas.DrawLine(319,140,360,115)

            //Drawing E
            ZapCanvas.DrawLine(380,100,450,100)
            ZapCanvas.DrawLine(380,150,450,150)
            ZapCanvas.DrawLine(380,200,450,200)
            ZapCanvas.DrawLine(387,100,387,200)

            //Drawing R
            ZapCanvas.DrawLine(470,90,470,210)
            ZapCanvas.DrawLine(469,95,520,120)
            ZapCanvas.DrawLine(469,140,520,115)
            ZapCanvas.DrawLine(480,130,520,205)

            //Drawing Z
            ZapCanvas.DrawLine(550,100,650,100)
            ZapCanvas.DrawLine(643,103,550,200)
            ZapCanvas.DrawLine(545,200,645,200)

            break
        case "won": //draws a smiley face
            ZapCanvas.DrawLine(200,150,400,150)
            ZapCanvas.DrawLine(200,300,400,300)
            ZapCanvas.DrawLine(460,100,500,100)
            ZapCanvas.DrawLine(460,350,500,350)
            ZapCanvas.DrawLine(500,100,500,350)
            break
            
        case "lost": //draws a frowny face
            ZapCanvas.DrawLine(200,150,400,150)
            ZapCanvas.DrawLine(200,300,400,300)
            ZapCanvas.DrawLine(460,100,500,100)
            ZapCanvas.DrawLine(460,350,500,350)
            ZapCanvas.DrawLine(460,100,460,350)
            break

    }
}
