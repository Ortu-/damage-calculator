function MiniGame() {
    
    var app = this;
    
    //Setup -----------------------------------------------------------------
    
    this.attacker = {
        str: 1,
        agi: 1,
        recoveryTime: 0,
        weapon: {}
    };
    
    this.defender = { 
        health: 100,
        armor: {}
    };    
    
    var dmgCalc = new DamageCalculator();
    
    //Init ----------------------------------------------------------
    
    this.init = function(){
        app.bindHandlers();
        $('#armor').change();
    }
    
    //UI handlers -------------------------------------------------------
    
    this.bindHandlers = function(){
        
        $('#attack').click(function(){
            
            var txt = $('#main').html() + "<br/><br/>";
            
            //get user selections
            app.attacker.str = $('#str').val();
            app.attacker.agi = $('#agi').val();
            
            var usedTwoHands = false;
            if($('#hands').val() == "both"){ usedTwoHands = true; }
            
            //get index of selected weapon and armor
            var weapon = $('#weapon').val();
            var tWeapon;
            for(var i = 0;i < dmgCalc.weapons.length; i++){
                if(dmgCalc.weapons[i].Name == weapon){ tWeapon = dmgCalc.weapons[i]; }
            }
            app.attacker.weapon = tWeapon;
            
            var vsArmor = $('#armor').val();
            var tArmor;
            for(var i = 0;i < dmgCalc.armor.length; i++){
                if(dmgCalc.armor[i].Name == vsArmor){ tArmor = dmgCalc.armor[i]; }
            }
            app.defender.armor = tArmor;
            
            var damageResult = dmgCalc.getAttackDamage(app.attacker, app.defender, usedTwoHands, "PrimaryAttack");
            
            app.attacker.recoveryTime = damageResult.recoveryTime;
            
            txt += damageResult.debugTxt + "Dealt:<br/>"
            txt += damageResult.damage + " Damage<br/>";
            txt += damageResult.conDamage + " Damage to armor condition<br/><br/>";
            txt += "Required time to recover: " + app.attacker.recoveryTime + "ms";
            
            $('#main').html(txt);
            
            //apply and update results
            app.defender.health -= damageResult.damage;
            tArmor.Condition -= damageResult.conDamage;	
            
            var txt = "Enemy Health: " + app.defender.health + "<br/><br/>";
                txt += "Armor: " + vsArmor + "<br/>";	
                txt += "Condition: " + tArmor.Condition + "<br/>";
                
            $('#results').html(txt);			
        });
        
        $('#armor').change(function(){
            $('#main').html('');
            var vsArmor = $('#armor').val();
            var tArmor;
            for(var i = 0;i < dmgCalc.armor.length; i++){
                if(dmgCalc.armor[i].Name == vsArmor){ tArmor = dmgCalc.armor[i]; }
            }
            
            app.defender.health = 100;
            tArmor.Condition = 100;
            
            var txt = "Enemy Health: " + app.defender.health + "<br/><br/>";
                txt += "Armor: " + vsArmor + "<br/>";	
                txt += "Condition: " + tArmor.Condition + "<br/>";
                
            $('#results').html(txt);
        });
        
        $('#weapon').change(function(){
            $('#armor').change();
        });
        
    }

    //Execute Construction --------------------------------------------------------------
    
    this.init();
    
}

//Page Load -----------------------------------------------------------------------------

$(function(){
    var app = new MiniGame();
});