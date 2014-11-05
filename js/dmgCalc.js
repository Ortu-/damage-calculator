/*

This file is released under the terms of the MIT License:

    Copyright (c) 2014 Josh Kirklin
	
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	http://opensource.org/licenses/MIT

*/

function DamageCalculator() {
    
    var app = this;
    
    //Setup -----------------------------------------------------------------
    
    this.weapons = [
        {Name: "Dagger",
         Mass: 1,
         Length: 1,
         Control: 5,
         GripType: "Hilted",
         TwoHandedAllowed: false,
         OffHandAllowed: true,
         ParryAllowed: false,
         PrimaryAttack: {
             AttackType: "Thrust",
             DamageType: "Piercing",
             Penetrating: true,
             Destructive: false
         },
         SecondaryAttack: {
             AttackType: "Swing",
             DamageType: "Slashing",
             Penetrating: false,
             Destructive: false
         }
        },
        {Name: "Arming Sword",
         Mass: 3,
         Length: 3,
         Control: 4,
         GripType: "Hilted",
         TwoHandedAllowed: true,
         OffHandAllowed: true,
         ParryAllowed: true,
         PrimaryAttack: {
             AttackType: "Swing",
             DamageType: "Slashing",
             Penetrating: false,
             Destructive: false
         },
         SecondaryAttack: {
             AttackType: "Thrust",
             DamageType: "Piercing",
             Penetrating: false,
             Destructive: false
         }
        },     
        {Name: "Morningstar",
         Mass: 5,
         Length: 3,
         Control: 2,
         GripType: "Hafted",
         TwoHandedAllowed: true,
         OffHandAllowed: false,
         ParryAllowed: true,
         PrimaryAttack: {
             AttackType: "Swing",
             DamageType: "Piercing",
             Penetrating: true,
             Destructive: false
         }
        },        
        {Name: "Francisca",
         Mass: 3,
         Length: 4,
         Control: 3,
         GripType: "Hafted",
         TwoHandedAllowed: true,
         OffHandAllowed: false,
         ParryAllowed: true,
         PrimaryAttack: {
             AttackType: "Swing",
             DamageType: "Slashing",
             Penetrating: false,
             Destructive: true
         }
        }
    ];
    
    this.armor = [
        {Name: "Padded Leather",
         Condition: 100,
		 Absorption: 50,
         Slashing: {
             Resistance: 263.4,
             Durability: 35
         },
         Piercing: {
             Resistance: 219.5,
             Durability: 50
         },
         Crushing: {
             Resistance: 878.0,
             Durability: 85
         }
        },
        {Name: "Chainmail",
         Condition: 100,
		 Absorption: 35,	 
         Slashing: {
             Resistance: 439.0,
             Durability: 70
         },
         Piercing: {
             Resistance: 263.4,
             Durability: 35
         },
         Crushing: {
             Resistance: 702.4,
             Durability: 80
         }
        },    
        {Name: "Platemail",
         Condition: 100,
		 Absorption: 65,		 
         Slashing: {
             Resistance: 597.04,
             Durability: 75
         },
         Piercing: {
             Resistance: 544.36,
             Durability: 85
         },
         Crushing: {
             Resistance: 526.8,
             Durability: 40
         }
        }        
    ];	
    
    //Init ------------------------------------------------------------------
    
    this.init = function(){

    }

    //Calculation -----------------------------------------------------------
    
    this.getAttackDamage = function(attacker, defender, usedTwoHands, attackMode){
        
        var txt = "";
        
        var str = attacker.str;
        var agi = attacker.agi;
        var tWeapon = attacker.weapon;
        var tArmor = defender.armor;
        
        var recoveryTime = 1500 - (tWeapon.Control * 250);
        
        //calculate applied force
        var force = 20.0 + (10.0 * tWeapon.Mass);
            
            force += (5.0 * tWeapon.Length) - 15.0;
            
            if(tWeapon.Mass >= 3){
                force *= str;
                force *= (1.0 + (agi / 100.0));
            }
            else{
                force *= agi;
                force *= (1.0 + (str / 100.0));
            }
            
            if(tWeapon.Mass < 5 && usedTwoHands){ force *= 1.25; }
            
            if(tWeapon.Mass == 5 && !usedTwoHands){ 
                force /= 2.0; 
                recoveryTime *= 1.5;
            }
            
            //if(tWeapon.GripType == "Hilted" && tWeapon.PrimaryAttack.AttackType == "Thrust" && tWeapon.Mass >= 3){ 
			if(tWeapon.GripType == "Hilted" && tWeapon[attackMode].AttackType == "Thrust" && tWeapon.Mass >= 3){ 
                force /= 2.0; 
                recoveryTime *= 1.5;
            }
            
            //if(tWeapon.GripType == "Hafted" && tWeapon.PrimaryAttack.AttackType == "Thrust" && !usedTwoHands){ force /= 2.0; }
			if(tWeapon.GripType == "Hafted" && tWeapon[attackMode].AttackType == "Thrust" && !usedTwoHands){ force /= 2.0; }
            
            if(tWeapon[attackMode].Penetrating){ force *= 1.25; }
            
            txt += "Applied Force: " + force + "<br/>";
            
        //calculate resulting damage
		var effectiveness = 100.0 - (100.0 - tArmor.Condition) * 2.0;
		
        var appliedAbsorption = 1.0 - (tArmor.Absorption / 100.0) * (effectiveness / 100.0);
        
        var appliedResistance = tArmor[tWeapon[attackMode].DamageType].Resistance * (effectiveness / 100.0);
        
        txt += "Applied Resistance: " + appliedResistance + "<br/>";
        
        var appliedDurability;
        var damage;
        var conDamage;
        if(force > appliedResistance){
            appliedDurability = 1.0 - (tArmor[tWeapon[attackMode].DamageType].Durability / 100.0);
            damage = force * (appliedAbsorption * 2.0) * 0.1;
            conDamage = force * appliedDurability * 1.5 / 10.0;
        }
        else{
            appliedDurability = 1.0 - ((tArmor[tWeapon[attackMode].DamageType].Durability + tArmor.Crushing.Durability) / 200.0);
            damage = (force * appliedAbsorption) * 0.1;
            conDamage = force * appliedDurability / 10.0;
        }
        
        if(tWeapon[attackMode].Destructive){ conDamage *= 1.25; }
        
        var conDamage = conDamage / 2.0;
        
        damage = parseInt(damage);
        conDamage = parseInt(conDamage);
        
        return {damage: damage, conDamage: conDamage, recoveryTime: recoveryTime, debugTxt: txt};

    }

    //Execute Construction --------------------------------------------------------------
    
    this.init();
    
}