const cards = [
  {
    name: 'chess',
    frotFile: 'png',
    backFile: 'svg',
  },
  { name: 'animal', frotFile: 'svg', backFile: 'png' },
  {
    name: 'fruit',
    frotFile: 'png',
    backFile: 'png',
  },
  {
    name: 'transportation',
    frotFile: 'svg',
    backFile: 'svg',
  },
];
const difficulty = [8, 16, 32];
const cardIndex = [];
const user = {};
const score = {
  user: 0,
  computer: 0,
};

$('.choose-form').on('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputCard = +Object.fromEntries(formData).card;
  const inputDifficulty = +Object.fromEntries(formData).difficulty;

  if (inputCard > cards.length - 1) {
    user.card = Math.round(Math.random() * (cards.length - 1));
  } else {
    user.card = inputCard;
  }

  user.difficulty = difficulty[inputDifficulty];
  $('.container').css(
    'background-image',
    `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
  url('./src/img/bg-${user.card + 1}.jpg')`
  );
  $('.game-container').css('display', 'block');
  $('.choose-container').css('display', 'none');
  startGameHandler();
});

function startGameHandler() {
  score.user = 0;
  score.computer = 0;
  $('.score-user').text(score.user);
  $('.score-computer').text(score.computer);
  for (let i = 0; i < user.difficulty; i++) {
    const cardEl = $(`
    <button type='button' class="card card-close">
    <span class="card-front"></span>
    <span class="card-back"></span>
    </button>
  `);
    $('.game').append(cardEl);
  }

  $('.card-back').css(
    'background-image',
    `url('./src/img/card-bg-${user.card + 1}.${cards[user.card].backFile}')`
  );
  for (let i = 0; i < $('.card').length; i++) {
    const num = (i % ($('.card').length / 2)) + 1;

    $('.card')
      .eq(i)
      .find('.card-front')
      .css(
        'background-image',
        `url('./src/img/${cards[user.card].name}-${num}.${
          cards[user.card].frotFile
        }')`
      );

    const target = Math.round(Math.random() * $('.card').length - 1);
    $('.card').eq(target).insertAfter($('.card').eq(i));
  }
}

$('.game').on('click', '.card', function () {
  if (
    $('.card:not(.card-close)').length < 2 &&
    $(this).hasClass('card-close') &&
    !$(this).hasClass('card-ok')
  ) {
    if ($('.card:not(.card-close)').length === 0) {
      cardIndex[0] = $(this).index();
    } else {
      cardIndex[1] = $(this).index();
    }
    $(this).removeClass('card-close');
  }

  if ($('.card:not(.card-close)').length === 2) {
    $('.card').attr('disabled', true);
    isGetScoreHandler('user');
    isEndGameHandler();
    setTimeout(openCardHandler, 1200);
  }
});

function openCardHandler() {
  if ($('.card-ok').length === $('.card').length) {
    return;
  }

  cardIndex[2] = getCardIndexHandler();
  cardIndex[3] = getCardIndexHandler();

  for (let i = 0; i < 4; i++) {
    for (let j = 2; j < i; j++) {
      if (cardIndex[j] === cardIndex[i]) {
        cardIndex[j] = getCardIndexHandler();
        i--;
        break;
      }
      if (j == 2 && $('.card').eq(cardIndex[2]).hasClass('card-ok')) {
        cardIndex[2] = getCardIndexHandler();
        i--;
        break;
      }
      if ($('.card').eq(cardIndex[3]).hasClass('card-ok')) {
        cardIndex[3] = getCardIndexHandler();
        i--;
        break;
      }
    }
  }

  $('.card').eq(cardIndex[2]).removeClass('card-close');
  $('.card').eq(cardIndex[3]).removeClass('card-close');
  isGetScoreHandler('computer');
  isEndGameHandler('computer');
}

function getCardIndexHandler() {
  return Math.round(Math.random() * $('.card').length - 1);
}

function getOpenCardNumberHandler(value) {
  return value
    .children()
    .css('background-image')
    .split('/')
    .pop()
    .split('-')[1]
    .split('.')[0];
}

function isGetScoreHandler(type) {
  const cardOne = getOpenCardNumberHandler($('.card:not(.card-close)').eq(0));
  const cardTwo = getOpenCardNumberHandler($('.card:not(.card-close)').eq(1));

  if (cardOne === cardTwo) {
    if (type === 'user') {
      score.user++;
    } else {
      score.computer++;
    }
    $('.score-user').text(score.user);
    $('.score-computer').text(score.computer);
    $('.card:not(.card-close)').addClass('card-ok');
    $('.card-ok').fadeTo(1000, 0);
  }
}

function isEndGameHandler(type = 'user') {
  setTimeout(() => {
    let text = '';
    let icon = 'success';
    let title = '恭喜';
    if (score.user === score.computer) {
      text = '平手';
    } else if (score.user > score.computer) {
      text = '玩家獲勝';
    } else {
      text = '電腦獲勝';
      icon = 'warning';
      title = '遊戲結束';
    }

    $('.card:not(.card-close)').addClass('card-close');
    if ($('.card-ok').length === $('.card').length) {
      Swal.fire({
        icon,
        title,
        text,
      }).then(() => {
        $('.choose-container').css('display', 'block');
        $('.container').css('background-image', '');
        $('.card').remove();
      });
    }

    if (type === 'computer') {
      $('.card').attr('disabled', false);
    }
  }, 1000);
}
