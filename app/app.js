import Rx from 'rxjs'

const domContainer = document.querySelector('[data-container]')

const clickElement = document.querySelector('[data-init-fetch]')
const loader = document.querySelector('.loader')

// only emit when all the data is returned 
const fetchData = (first, last) => Rx.Observable.range(first, last)
  .flatMap(async n => {
    const res = await fetch(`https://swapi.co/api/people/${n}`)
    return await res.json()
  })
  .reduce((acc, item) => [...acc, item], [])

const createEventStream = ({
  domNode,
  createRequestDataAction,
  createReceiveDataAction,
}) => {

  const handleButtonClick = Rx.Observable.fromEvent(domNode, 'click')

  const request = fetchData(1, 10)

  const setIsFetching = handleButtonClick
    .map(createRequestDataAction)

  const requestData = handleButtonClick
    .switchMapTo(request)
    .map(createReceiveDataAction)

  return Rx.Observable.merge(
    requestData,
    setIsFetching,
  )
}

const initState = {
  offset: 1,
  isFetching: false,
  chars: [],
}

createEventStream({
  domNode: clickElement,
  createReceiveDataAction,
  createRequestDataAction,
})
  .scan(reducer, initState)
  .subscribe(
    renderMarkup,
  )

function reducer (
  state = initState,
  {
    type,
    payload,
  }
) {
  switch (type) {
    case 'apiReceive': {
      return {
        ...state,
        isFetching: false,
        chars: [
          ...state.chars,
          ...payload.chars,
        ],
      }
    }
    case 'apiRequest': {
      return {
        ...state,
        offset: state.offset += 10,
        isFetching: true,
      }
    }

    default: {
      return state
    }
  }
}

function renderMarkup({
  chars,
  isFetching,
}) {
  if (isFetching) {
    domContainer.classList.add('fetching')
    loader.classList.add('fetching')
  } else {
    domContainer.classList.remove('fetching')
    loader.classList.remove('fetching')
  }
  domContainer.innerHTML = chars
    .reduce((acc, { name }) => acc + `
      <div>
        ${name}
      <div />
    `, '')
}

function createReceiveDataAction(data) {
  return {
    type: 'apiReceive',
    payload: {
      chars: [...data],
    },
  }
}

function createRequestDataAction() {
  return { type: 'apiRequest' }
}
