<template>
  <div class="view-home">
    <BaseGrid>
      <BaseCard title="HOW TO PLAY">
        <div class="how-to-play">
          <section>
            <p>
              BATTLE HEROES は自分の Pixel Heroes NFT
              でバトルを楽しめるシンプルなゲームです。
            </p>
            <p>
              <strong>自分のバトルを作成</strong>
              するか
              <strong>他プレイヤーのバトルへ参加</strong>
              することでバトルが開始されます。
            </p>
            <p>
              <del>
                現在、他のオンラインプレイヤーがいないと遊ぶことができません。
              </del>
            </p>
            <p>
              <strong>
                1人プレイ用の「モンスターバトル」モードを追加しました。
              </strong>
            </p>
            <p>
              <router-link :to="{ name: 'battles' }"> バトル一覧 </router-link>
              の
              <strong class="how-to-play-monster-battle">MOSTER BATTLE</strong>
              ボタンを押すことでモンスターとバトルすることができます。
            </p>
            <p>
              モンスターバトルでは勝敗数や経験値は残らないので、バトルの練習や対戦相手のプレイヤーがいない場合などに気軽にプレイしてください。
            </p>
          </section>
          <section>
            <h1>1. 自分のバトルを作成</h1>
            <p>
              <strong class="how-to-play-create">CREATE</strong>
              ボタンを押してバトルに使用するヒーローを選択すると自分のバトルを作成することができます。
            </p>
            <p>他のプレイヤーがバトルに参加するとバトル開始となります。</p>
            <p>
              他のプレイヤーがいない場合や別のヒーローでバトルを作成しなおす場合などは
              <strong class="how-to-play-delete">DELETE</strong>
              ボタンで削除することができます。
            </p>
          </section>
          <section>
            <h1>2. 他プレイヤーのバトルに参加</h1>
            <p>
              他のプレイヤーが作成したバトルに
              <strong class="how-to-play-join">JOIN</strong>
              ボタンを押すことでバトルに参加することができます。
            </p>
            <p>
              他のプレイヤーのバトルは
              <router-link :to="{ name: 'battles' }"> バトル一覧 </router-link>
              か
              <router-link :to="{ name: 'players' }">
                プレイヤー一覧
              </router-link>
              で確認することができます。
            </p>
          </section>
          <section>
            <h1>3. バトル</h1>
            <p>
              バトルは1対1のターン制コマンドバトルで、先に相手の
              <span class="how-to-play-status">HP = 体力</span>
              を 0 にしたほうが勝利となります。
            </p>
            <p>
              現在選べるコマンドは
              <strong class="how-to-play-attack">ATTACK</strong>
              または
              <strong class="how-to-play-heal">HEAL</strong>
              の2種類です。
            </p>
          </section>
          <section>
            <h1>3-2. バトルコマンド</h1>
            <h2>1. ATTACK = 攻撃</h2>
            <p>相手の HP を減らすことができます。</p>
            <p>
              与えるダメージはプレイヤーの
              <span class="how-to-play-status">ATTTACK = 攻撃力</span>
              と相手の
              <span class="how-to-play-status">DEFENCE = 防御力</span>
              によって決まります。
            </p>
            <p>
              また、一定確率でクリティカルヒット（大ダメージ）やミス（ダメージを与えられない）が発生することがあります。
            </p>
            <h2>2. HEAL = 回復</h2>
            <p>自分の HP を 0 ～ 100 回復することができます。</p>
            <p>
              回復は1バトル中に1回のみ使用可能なので双方の残り HP
              や攻撃力、防御力などを見て使うタイミングを考える必要があります。
            </p>
          </section>
          <section>
            <h1>3-3. バトル詳細</h1>
            <h2>ステータス</h2>
            <p>
              バトル時の以下のステータスは
              <strong>バトル開始時に</strong>
              ランダムで決定されます。
            </p>
            <p>
              ※
              ステータスはヒーロー毎の固定値ではなくバトルごとに都度決定されます。
            </p>
            <ul>
              <li>HP</li>
              <li>ATTTACK</li>
              <li>DEFENCE</li>
              <li>SPEED</li>
            </ul>
            <h2>先攻・後攻</h2>
            <p>
              <span class="how-to-play-status">SPEED = 素早さ</span>
              ステータスが高いほうが先攻、同じ場合はランダムに決定されます。
            </p>
          </section>
          <section>
            <h1>5. Discord への通知について</h1>
            <p>
              ゲーム内の状況は Pixel Heroes DAO の
              <span class="how-to-play-discord">#ゲーム実況</span>
              チャンネルに投稿されます。
            </p>
            <p>投稿されるタイミングは以下の3つです。</p>
            <ol>
              <li>バトルが作成されたとき</li>
              <li>バトル開始</li>
              <li>バトル終了</li>
            </ol>
          </section>
          <section>
            <h1>6. その他</h1>
            <p>BATTLE HEROES は現在開発中プロトタイプ段階です。</p>
            <p>
              <a href="https://discord.gg/H4YSsVHx" target="_blank">
                Pixel Heroes DAO
              </a>
              の
              <span class="how-to-play-discord">#🎮ゲーム｜games</span>
              チャンネルで新機能の検討や開発進捗などを公開しています。
            </p>
            <p>
              ゲームについてのアイデアや一緒に開発してくれるという方は気軽にチャンネルまでお越しください🚀
            </p>
          </section>
        </div>
      </BaseCard>
    </BaseGrid>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
