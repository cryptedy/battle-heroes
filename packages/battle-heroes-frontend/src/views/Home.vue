<template>
  <div class="view-home">
    <BaseGrid>
      <BaseCard title="遊び方">
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
              <router-link :to="{ name: 'battles' }"> バトル一覧 </router-link>
              の
              <strong class="how-to-play-monster-battle">
                オフラインバトル開始
              </strong>
              ボタンを押すことでモンスターとバトルすることもできます。
            </p>
          </section>

          <section>
            <h1>1. バトルの作成</h1>
            <p>
              <strong class="how-to-play-create">オンラインバトル作成</strong>
              ボタンを押してバトルに使用するヒーローを選択すると自分のバトルを作成することができます。
            </p>
            <p>他のプレイヤーがバトルに参加するとバトル開始となります。</p>
            <p>
              バトルを削除する場合は
              <strong class="how-to-play-delete">バトル削除</strong>
              ボタンで削除することができます。
            </p>
            <p>
              バトル作成から一定時間対戦相手が見つからない場合は、オフラインバトルを開始することもできます。
            </p>
            <p>
              オフラインバトル中も対戦相手は募集中のままなので、誰かがバトルを挑んできた場合は対人戦バトルとなります。
            </p>
          </section>

          <section>
            <h1>2. 他プレイヤーのバトルに参加</h1>
            <p>
              他のプレイヤーが作成したバトルに
              <strong class="how-to-play-join">バトルを挑む</strong>
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
            <p>コマンドは以下の4種類でそれぞれ使用回数が決まっています。</p>
            <ul>
              <li>攻撃 - 3回</li>
              <li>魔法 / 忍術 - 1回</li>
              <li>回復 - 1回</li>
              <li>防御 - 使用回数制限なし</li>
            </ul>
          </section>

          <section>
            <h1>3-1. バトルコマンド</h1>

            <h2>1. <strong class="how-to-play-attack">攻撃</strong></h2>
            <p><strong>物理攻撃で相手の HP を減らすことができます。</strong></p>
            <p>
              与えるダメージはプレイヤーの
              <span class="how-to-play-status">ATK = 攻撃力</span>
              と相手の
              <span class="how-to-play-status">DEF = 防御力</span>
              によって決まります。
            </p>
            <p>
              また、一定確率で
              <strong>クリティカルヒット（大ダメージ）</strong>
              や
              <strong>ミス（ダメージを与えられない）</strong>
              が発生することがあります。
            </p>
            <p>
              なお、
              <strong>相手が 防御 中の場合は与えるダメージが減少</strong>
              してしまいます。
            </p>
            <p>
              <strong>攻撃のバトル開始時の使用回数は3回</strong>
              ですが
              <strong>防御をすることで使用回数を2～3程度回復</strong>
              することができます。
            </p>

            <h2>2. <strong class="how-to-play-spell">魔法 / 忍術</strong></h2>
            <p>
              <strong>
                魔法 / 忍術攻撃で相手の HP を減らすことができます。
              </strong>
            </p>
            <p>
              与えるダメージはプレイヤーの
              <span class="how-to-play-status">INT = 知性</span>
              と相手の
              <span class="how-to-play-status">DEF = 防御力</span>
              によって決まります。
            </p>
            <p>
              攻撃と異なり相手が
              <strong class="how-to-play-defence">防御</strong>
              中の場合でも与えるダメージは変わりません。
            </p>
            <p>
              また、ミスやクリティカルもなく
              <strong>相手に必ずダメージを与える</strong>
              ことができる強力なコマンドです。
            </p>
            <p>
              ただし、
              <strong>魔法 / 忍術はバトル中1回のみ使用可能</strong>
              なためここぞというタイミングで使うと良いでしょう。
            </p>

            <h2>3. <strong class="how-to-play-heal">回復</strong></h2>
            <p>
              <strong>自分の HP を 0 ～ 100 回復することができます。</strong>
            </p>
            <p>
              <strong>回復は1バトル中に1回のみ使用可能</strong>
              なので双方の残り
              HPや攻撃力、防御力、各コマンドの残り回数などを見て使うタイミングを考える必要があります。
            </p>

            <h2>4. <strong class="how-to-play-defence">防御</strong></h2>
            <p>
              防御中は相手にダメージを与える攻撃はできませんが防御しながら力を溜めることで
              <strong>攻撃の使用回数を 1～3 程度回復</strong>
              することができます。
            </p>
            <p>
              防御後の1ターンは
              <strong>相手の攻撃のダメージを減らす</strong>
              ことができます。（
              <strong>魔法 / 忍術のダメージを減らすことはできません</strong>
              ）
            </p>
            <p>
              また、まれに
              <strong>
                防御後の次のターンの攻撃が必ずクリティカルヒットになる
              </strong>
              効果が発生することがあります。
            </p>
            <p>
              なお、
              <strong>防御に使用回数制限はない</strong>
              ので攻撃回数回復やクリティカル確定狙いなどさまざまなシーンで積極的に使っていきましょう。
            </p>
          </section>

          <section>
            <h1>3-2. バトル詳細</h1>
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
              <li>HP - 体力</li>
              <li>ATK - 攻撃力</li>
              <li>DEF - 防御力</li>
              <li>INT - 知性</li>
              <li>SPD - 素早さ</li>
            </ul>
            <h2>先攻・後攻</h2>
            <p>
              <span class="how-to-play-status">SPD = 素早さ</span>
              ステータスが高いほうが先攻、同じ場合はランダムに決定されます。
            </p>
          </section>

          <section>
            <h1>4. Discord への通知について</h1>
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
            <h1>5. その他</h1>
            <p>BATTLE HEROES は現在開発中プロトタイプ段階です。</p>
            <p>
              <a href="https://discord.gg/4dvq28zU" target="_blank">
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
