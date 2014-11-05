Physically Based Damage Calculation
===================================

This project provides a logical algorithm, and its implementation in code, for determining the result of an undefended attack within a game system.

It can be applied to any gaming medium, including video games, table-top games, pen and paper games, or any other game in which there is a need to determine the result of a physical weapon based attack by one player or character against another player or character with or without armor.

This calculation does not account for defensive actions such as blocking, parrying, and evasion, which should be determined and resolved before the calculation of undefended damage.



Goal
----

The intention of this system is to represent the interaction between characters, weapons, and armor, as based on the physical properties of these entities, rather than on arbitrary values based on such things as levels, rarity, and randomly generated numbers.

In many Role-playing Games (RPG), it is common for weapons to be given a 'damage' value and/or damage variance range, which combined with a 'speed' value can calculate a damage per second value (DPS). This DPS value is then the primary component in calculating damage dealt. This is then mitigated by an 'armor' value of the defender's armor. Under this method, the values assigned to any given weapon or armor is typically determined by that item's level and/or rarity. Under these common systems, you can have two swords, the exact same in size, shape, weight, even material, yet one of them may do significantly more damage due to being a higher 'level' or being more 'rare'.

The problem with this is that weapons and armor do not actually have physical properties of level, armor, damage, or speed. Realistically, damage is the result of applied force. Force is a result of mass and velocity. A weapon is an inert thing and has no inherent speed in and of itself. Speed, as velocity, is given to it by the user. Damage is a result, not a component factor, and while materials and quality should be factors, most of the advancement in a weapon's effectiveness is realistically on the side of the user. A master swordsman will be nearly as deadly with bronze as with steel, a novice will be equally poor with either.

Similarly, if attacking shifts its focus away from 'damage' and instead looks at force, armor can now utilize physical properties of resistance and absorption. If that armor is able to withstand the force of a blow, less damage should be done than if it is breached. When armor is able to physically resist, or fail to resist, the force of an attack, weapons which were historically designed to penetrate armor can gain such properties to differentiate them from weapons designed for use on flesh.

If armor is then given a property of condition, which reduces its ability to resist force as it takes more damage, then defenses can be breached and broken down over time allowing subsequent attacks to be more effective and to do more resulting damage to the defender.



Definitions
-----------

- Strength - An attribute of a character which rates that character's physical strength. Expected values are between 1 and 10.
- Agility - An attribute of a character which rates that character's physical speed for both action and reaction. Expected values are between 1 and 10.
- Health - An attribute of a character which represents the amount of damage a character can take before dying. Expected values are between 0 and 100.
- RecoveryTime - An attribute of a character which represents the amount of time in milliseconds that character needs in order to recover from making attack before doing anything else.

- Mass - An attribute of a weapon which rates that weapon's physical weight on a comparative scale. Expected values are between 1 and 5.
- Length - An attribute of a weapon which rates that weapon's physical size on a comparative scale. Expected values are between 1 and 5.
- Control - An attribute of a weapon which rates that weapon's balance and ease of use on a comparative scale. Expected values are between 1 and 5...
- Penetrating - An attribute of a weapon which describes that weapon as being better able to penetrate armor. Expected values are true or false...
- Destructive - An attribute of a weapon which describes that weapon as being able to cause extra damage to the condition of armor. Expected values are true or false...
- GripType - An attribute of a weapon which describes how the weapon is designed to be held. Expected values are "Hilted" or "Hafted"...
- TwoHandedAllowed - An attribute of a weapon which determines if that weapon may be used with both hands together. Expected values are true or false...
- OffHandAllowed - An attribute of a weapon which determines if that weapon may be used in the character's non-dominant hand. For example, in the left hand by a right handed person. Expected values are true or false...
- ParryAllowed - An attribute of a weapon which determines if that weapon may be used to parry the attack of another weapon. Expected values are true or false...

- AttackType - An attribute of an attack which describes the nature of the attacking motion. Expected values are "Swing", "Thrust", "Throw", or "Braced"...
- AttackUsedTwoHands - An attribute of an attack which states if an attack was made using both hands. Expected values are true or false...
- DamageType - An attribute of an attack which describes the nature of the damage done as a result of that attack. Expected values are "Slashing", "Piercing", or "Crushing"...
- Force - An attribute of an attack which describes the amount of phyiscal force generated by the weapon and its user during the attack...
- Damage - The result of an attack which reduces the the Health attribute of the defending character by the Damage amount...
- ConditionDamage - The result of an attack which reduces the the Condition attribute of the defending character's armor by the ConditionDamage amount...

- Condition - An attribute of armor which represents the amount of ConditionDamage that armor can take before being destroyed. Expected values are between 0 and 100...
- Effectiveness - An attribute of armor which represents how well that armor is able to apply its Absorption and Resistance attributes against an attack...
- Absorption - An attribute of armor which reduces the Force of an attack. Expected values are between 1 and 100...
- Resistance - An attribute of armor which describes how much Force of a given DamageType the armor can withstand. Expected values are between 1 and 100...
- Durability - An attribute of armor which describes how much Damage of a given DamageType is applied to the Condition attribute of the armor...



Logical Algorithm
-----------------

Calculate the time required for recovery on the attacking character:

	RecoveryTime = 1500 - (Control * 250)

Calculate the applied force of an attack based on the relevant attributes of the character making the attack and the weapon used in the attack:

	Force = 20.0 + (10.0 * Mass)

	Force = Force - 15.0 + (5.0 * Length)

	If Mass >= 3 Then 
		Force = Force * Strength 
		Force = Force * (1.0 + (Agility / 100.0))
	Else
		Force = Force * Agility
		Force = Force * (1.0 + (Strength / 100.0))
		
	If Penetrating is true Then
		Force = Force * 1.25
		
	If Mass < 5 and AttackUsedTwoHands is true Then
		Force = Force * 1.25

	If Mass == 5 and AttackUsedTwoHands is false Then
		Force = Force / 2.0
		RecoveryTime = RecoveryTime * 1.5
		
	If GripType == Hilted and AttackType == Thrust and Mass >= 3 Then
		Force = Force / 2.0
		RecoveryTime = RecoveryTime * 1.5
		
	If GripType == Hafted and AttackType == Thrust and AttackUsedTwoHands is false Then
		Force = Force / 2.0
		
Calculate the resulting Damage and ConditionDamage based on the applied Force value against the relevant attributes of the armor in use by the character being attacked:
	
	Effectiveness = 100.0 - (100.0 - Condition) * 2.0
	
	AppliedAbsorption = 1.0 - (Absorption / 100.0) * (Effectiveness / 100.0)
	
	AppliedResistance = (Resistance to DamageType) * (Effectiveness / 100.0)
	
	If Force > AppliedResistance Then
		AppliedDurability = 1.0 - ((Durability to DamageType) / 100.0)
		Damage = Force * (AppliedAbsorption * 2.0) * 0.1
		ConditionDamage = Force * AppliedDurability * 1.5 / 10.0
	Else
		AppliedDurability = 1.0 - (((Durability to DamageType) + (Durability to Crushing)) / 200.0)
		Damage = (Force * AppliedAbsorption) * 0.1
		ConditionDamage = Force * AppliedDurability / 10.0

	If Destructive is true Then
		ConditionDamage = ConditionDamage * 1.25
		
	ConditionDamage = ConditionDamage / 2.0		
		
Apply resulting Damage and ConditionDamage to the relevant attributes of the character and armor being attacked:

	Health = Health - Damage
	Condition = Condition - ConditionDamage
	
	If Health <= 0 Then
		character is dead
		
	If Condition <= 0 Then
		armor is destroyed
		
		
		
Licensing
---------		
		
This documentation is released under the terms of the MIT License:

Copyright (c) 2014 Josh Kirklin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

http://opensource.org/licenses/MIT
		