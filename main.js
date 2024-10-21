"use strict"

//Constants
const ZapCanvas = new Canvas("holder", 700, 500)
const Update_Time = 50
const Shield_Count = 4
const Alien_Count = 55
const Shield_YRadius = 6
const Shield_XRadius = 30
const Alien_XRadius = 20
const Alien_YRadius = 20
const Gun_XRadius = 21
const Gun_YRadius = 30
const StartButton = document.getElementById("start")

//UI Globals
let score = 0
let lives = 3
let isGunFired = false
let hit = false
let isAlienFired = false
let alienRandom = 0
let alienHit = false
let aimAssist = false
let moveRight = true
let stopMoveDown = false
let isInit = false
let active = false
let timer = null
let gun = null
let gunLaser = null
let alienLaser = null
let modifier = 0.2
let aliveAliens = 0
let prevAliveAliens = 0
let minCorner = 0
let maxCorner = 10

/**
 * Sets the time action for all of the animation
 */
function TimeAction()
{
    if(active)
    {
        ZapCanvas.Clear()

        for(let i = 0; i < shields.length; i++) //shield loop
        {
            if(!shields[i].destroyed)
            {
                shields[i].Draw()

                if(isGunFired) //detects if a gun has shot the shield
                {    
                    hit = FindHit_Gun(i, "shield")
            
                    if(hit)
                    {
                        shields[i].Hit()
                        MakeComment()
                        isGunFired = false
                        hit = false
                    }
                }

                if(isAlienFired) //detects if an alien has shot the shield
                {
                    alienHit = FindHit_Alien(i, "shield")
            
                    if(alienHit)
                    {
                        shields[i].Hit()
                        isAlienFired = false
                        alienHit = false
                    }
                }
            }
        }

        for(let i = 0; i < Alien_Count; i++) //alien loop
        {
            aliens[i].speed = modifier

            if(aliens[i].isAlive) //still exist in array but is not drawn so collision is ignored
            {
                aliens[i].Draw()
            }

            if(moveRight)
            {
                aliens[i].Move("right")
            }
            else
            {
                aliens[i].Move("left")
            }

            if(aliens[i].ypos > ZapCanvas.Height/1.05 && aliens[i].isAlive) //if the aliens reach the bottom of the shield
            {
                ResetAlienPos() //resets alien position
                LostLife() //losses a life
            }

            if(isGunFired) //detect if the gun shot an alien
            {
                hit = FindHit_Gun(i, "alien")
        
                if(hit)
                {
                    ExplodeAlien(i)
                    aliens[i].isAlive = false
                    MakeComment("NICE SHOT :D")
                    isGunFired = false
                    hit = false
                }
            }

            //picks a random number to determine if that alien can shoot
            alienRandom = Math.floor(Math.random() * 4096)

            if(alienRandom % 825 == 87 && !isAlienFired && aliens[i].isAlive)
            {
                if(aliens[i].shotsLeft > 0)
                {
                    alienLaser = new Laser(aliens[i].xpos, aliens[i].ypos+16, ZapCanvas, "alien")
                    isAlienFired = true
                    aliens[i].shotsLeft -= 1
                }
            }
        }

        aliveAliens = CountAliens()

        if(aliveAliens % 5 == 4 && prevAliveAliens != aliveAliens) //for every five aliens that are dead, the speed increases
        {
            modifier += 0.2
            prevAliveAliens = aliveAliens //a fail safe to prevent the aliens from speeding up every frame
        }

        if(aliveAliens != 0) //Checks if the aliens are alive, if not, the player won the game
        {
            if(aliens[minCorner].xpos > 670 || aliens[minCorner].xpos < 30 || aliens[maxCorner].xpos > 670 || aliens[maxCorner].xpos < 30) //determines if the aliens should move down
            {
                for(let i = 0; i < Alien_Count; i++)
                {
                    aliens[i].Move("down")
                }

                if(!moveRight)
                {
                    moveRight = true
                }
                else
                {
                    moveRight = false
                }
            }
        }
        else
        {
            SetScore(200)
            GameWon()
        }

        gun.Draw(aimAssist)
        
        if(isAlienFired) //checks if the aliens hit the gun by laser
        {
            alienHit = FindHit_Alien(gun, "gun")

            if(alienHit)
            {
                gun.Hit()
                SetScore(-75)
                LostLife()
                isAlienFired = false
                alienHit = false
            }
        }

        if(isGunFired) //handles if the gun is fired
        {
            if(gunLaser.ypos >= 0 && !hit)
            {
                gunLaser.Draw()
                gunLaser.Move()
            }
            else
            {
                isGunFired = false
                hit = false
                MakeComment()
            }
        }

        if(isAlienFired) //handles if the alien fires a laser
        {
            if(alienLaser.ypos <= ZapCanvas.Height)
            {
                alienLaser.Draw()
                alienLaser.Move()
            }
            else
            {
                isAlienFired = false
                alienHit = false
            }
        }

        timer = setTimeout(TimeAction, Update_Time)
    }
}

/*
 * Gets the key down from the user
 */
function GetKey(event)
{
    if(active)
    {
        if(event.key == "f" && !isGunFired)
        {
            isGunFired = true
            gunLaser = new Laser(gun.xpos, gun.ypos-30, ZapCanvas, "gun")
            MakeComment("FIRE! D:<")
        }
        else
        {
            gun.Move(event.key)
        }
    }
}

/**
 * Sets the score of the score board. Use positive number to add score, use negative number to subtract score
 */
function SetScore(scoreNum)
{
    let span = document.getElementById("Score")
    score += scoreNum
    span.innerHTML = `Score: ${score}`

}

/*
 * Handles losing a life
 */
function LostLife()
{
    lives--
    let span = document.getElementById("Lives")
    MakeComment("OUCH! :(")
    if(lives > 0)
    {
        span.innerHTML = `Lives: ${lives}`
    }
    else
    {
        span.innerHTML = "No Lives"
        GameLost()
    }
}

/*
 * Writes a comment to the funny comment title
 */
function MakeComment(comment)
{
    let span = document.getElementById("Comment")
    if(comment != undefined)
    {
        span.innerHTML = comment
    }
    else //if comment is blank, it'll write ... by default
    {
        span.innerHTML = "..."
    }
    
}

/*
 * Counts how many aliens are alive
 */
function CountAliens()
{
    let count = 0
    let changeMin = true
    let changeMax = true

    for(let i = 0; i < Alien_Count; i++)
    {
        if(aliens[i].isAlive)
        {
            count++
            if(i % 11 == minCorner) 
            {
                changeMin = false
            }

            if(i % 11 == maxCorner)
            {
                changeMax = false
            }
        }
    }

    /*
        this determines how an corner alien hits an edge (by default it's index 0 (min) and index 11 (max))
        If the column doesn't exist for min, their corner increments
        if it's for the max, their corner decrements
    */
    if(changeMin)
    {
        minCorner++
    }
    
    if(changeMax)
    {
        maxCorner--
    }

    return count
}

/*
 * Finds the hit for the gun
 */
function FindHit_Gun(i, object)
{
    let hitReturn = false
    let xd = 0 //distance from target
    let yd = 0

    switch(object)
    {
        case "shield":
            let shield = shields[i]

            yd = Math.abs(shield.ypos - gunLaser.ypos)
            xd = Math.abs(shield.xpos - gunLaser.xpos)

            if(yd <= Shield_YRadius && xd <= Shield_XRadius)
            {
               hitReturn = true
            }

            break
        case "alien":
            let alien = aliens[i]

            if(alien.isAlive)
            {
                yd = Math.abs(alien.ypos - gunLaser.ypos)
                xd = Math.abs(alien.xpos - gunLaser.xpos)
    
                if(yd <= Alien_YRadius && xd <= Alien_XRadius)
                {
                    hitReturn = true
                    SetScore(100)
                }
            }

            break
    }

    return hitReturn
}

/**
 * Finds a hit for the alien
 */
function FindHit_Alien(i, object)
{
    let hitReturn = false
    let xd = 0 //distance from target
    let yd = 0

    switch(object)
    {
        case "shield":
            let shield = shields[i]

            yd = Math.abs(alienLaser.ypos - shield.ypos)
            xd = Math.abs(shield.xpos - alienLaser.xpos)

            if(yd <= Shield_YRadius+3 && xd <= Shield_XRadius)
            {
               hitReturn = true
            }

            break

        case "gun":
            let gun = i

            yd = Math.abs(gun.ypos - alienLaser.ypos)
            xd = Math.abs(gun.xpos - alienLaser.xpos)

            if(yd <= Gun_YRadius && xd <= Gun_XRadius)
            {
                hitReturn = true
            }

            break
    }

    return hitReturn
}

//The hits need to be seperate as it was conflicting when all of the cases are combined.

/**
 * Handles exploding the alien
 */
function ExplodeAlien(i)
{
    active = false

    aliens[i].DrawExplode()

    active = true
}

/**
 * Resets the aliens position if they reach the bottom of the map
 */
function ResetAlienPos()
{
    //does the same process as intialize but doesn't add new aliens
    let distance_x = 650
    let distance_y = 450
    for(let i = 0; i < Alien_Count; i++)
    {
        if(i % 11 == 0 && i != 0)
        {
            distance_x = 650
            distance_y -= 40
        }

        aliens[i].xpos = ZapCanvas.Width-distance_x
        aliens[i].ypos = ZapCanvas.Height-distance_y

        distance_x -= 50
    }
}

/**
 * Activation event for the start button
 */
function StartGame()
{
    if(!active)
    {
        let span = document.getElementById("Lives")
        span.innerHTML = `Lives: ${lives}`

        span = document.getElementById("Score")
        span.innerHTML = `Score: ${score}`

        MakeComment()
        timer = setTimeout(TimeAction, Update_Time)
        active = true
    }
}

/**
 * Initialization period if the player won
 */
function GameWon()
{
    active = false

    //This pops all of the arrays because the game needs to be re initialized
    for(let i = 0; i < Shield_Count; i++)
    {
        shields.pop()
    }

    for(let i = 0; i < Alien_Count; i++)
    {
        aliens.pop()
    }

    //Doesn't reset other values to increase difficulty next round.
    minCorner = 0
    maxCorner = 11
    isGunFired = false
    isAlienFired = false

    MakeComment("You Win! :D Press Start Game to keep going")
    GameInit()
    ZapCanvas.Clear()
    DrawStartScreen("won")
}

/**
 * Initialization period if the player lost
 */
function GameLost()
{
    active = false

    //This pops all of the arrays because the game needs to be re initialized
    for(let i = 0; i < Shield_Count; i++)
    {
        shields.pop()
    }

    for(let i = 0; i < Alien_Count; i++)
    {
        aliens.pop()
    }

    //values are reset, starting with the easiest difficulty
    minCorner = 0
    maxCorner = 11
    modifier = 0.5
    moveRight = true
    score = 0
    lives = 3
    isGunFired = false
    isAlienFired = false

    MakeComment("You Lost :( Press Start Game to try again")
    GameInit()
    ZapCanvas.Clear()
    DrawStartScreen("lost")
}

ZapCanvas.AddListener("keydown", GetKey)
StartButton.addEventListener("click", StartGame)

let shields = []
let aliens = []

//Initializes game objects
function GameInit()
{
    gun = new Gun(ZapCanvas.Width/2, ZapCanvas.Height, ZapCanvas)

    //shield creation
    let distance = 140 //starting at 140 so that there's an offset to the shield distance
    for(let i = 0; i < Shield_Count; i++)
    {
        shields.push(MakeShield(distance))
        distance += 140
    }

    //alien creation
    let distance_x = 650
    let distance_y = 450
    for(let i = 0; i < Alien_Count; i++)
    {
        if(i % 11 == 0 && i != 0)
        {
            distance_x = 650
            distance_y -= 40
        }

        aliens.push(new Alien(ZapCanvas.Width-distance_x, ZapCanvas.Height-distance_y, ZapCanvas, i))
        distance_x -= 50
    }

    gunLaser = new Laser(gun.xpos, gun.ypos, ZapCanvas, "gun")
    alienLaser = new Laser(aliens[0].xpos, aliens[0].ypos, ZapCanvas, "alien")
}

GameInit()
MakeComment("Press Start Game To Play")
DrawStartScreen("start")