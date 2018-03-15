import Rx from 'rxjs'

const domContainer = document.querySelector('[data-container]')

const clickElement = document.querySelector('[data-init-fetch]')

const fetchData = (first, last) => Rx.Observable.range(first, last)
  .flatMap(async n => {
    const res = await fetch(`https://swapi.co/api/people/${n}`)
    return await res.json()
  })

const eventStream = ({
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
  isFetching: false,
  chars: [],
}

eventStream({
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
  console.log(type)
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
        isFetching: true,
      }
    }

    default: {
      return state
    }
  }
}

function renderMarkup(state) {
  domContainer.innerHTML = state.chars
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
      chars: [data],
    },
  }
}

function createRequestDataAction(evt) {
  return { type: 'apiRequest' }
}
