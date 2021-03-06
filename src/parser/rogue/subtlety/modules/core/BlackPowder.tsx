import React from 'react';
import Analyzer, { SELECTED_PLAYER, Options } from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import Events, { DamageEvent } from 'parser/core/Events';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import ItemDamageDone from 'interface/ItemDamageDone';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

class BlackPowder extends Analyzer {
  damage: number = 0;
  constructor(options: Options) {
    super(options);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.BLACK_POWDER), this.onDamage);
  }

  onDamage(event: DamageEvent) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return (
      <Statistic
        size="flexible"
        category={STATISTIC_CATEGORY.GENERAL}
      >
        <BoringSpellValueText spell={SPELLS.BLACK_POWDER}>
          <ItemDamageDone amount={this.damage} />
        </BoringSpellValueText>
      </Statistic>
    )
  }
}

export default BlackPowder;