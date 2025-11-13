import React, { useState, useEffect } from 'react'

function Header({ user, onMenu }) {
  return (
    <header className="flex items-center justify-between p-4">
      <div>
        <h1 className="text-brandRed font-bold text-xl">Bem Vindo(a), Aluno(a) !</h1>
        {user && <div className="text-sm text-brandRed">id: {user.id}</div>}
      </div>
      <button onClick={onMenu} className="p-2 rounded-md bg-white/30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#1f8a4d" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </header>
  )
}

function MealCard({ title, body, reserved, onReserve }) {
  return (
    <div className="bg-brandGreen text-white p-6 rounded-2xl w-full max-w-md mx-auto shadow-md">
      <h2 className="text-center font-bold text-lg mb-3">{title}</h2>
      <div className="mb-4 whitespace-pre-line">{body}</div>
      <div className="flex justify-center">
        {reserved ? (
          <button className="px-4 py-2 rounded-full bg-white text-brandRed border border-gray-200">Reservado !</button>
        ) : (
          <button onClick={onReserve} className="px-4 py-2 rounded-full bg-white text-brandGreen">Reservar Refeição</button>
        )}
      </div>
    </div>
  )
}

function ConfirmButtons({ onConfirm, onCancel }) {
  return (
    <div className="flex gap-4 justify-center mt-6">
      <button onClick={onConfirm} className="px-6 py-2 rounded-full bg-brandGreen text-white">Confirmar</button>
      <button onClick={onCancel} className="px-6 py-2 rounded-full bg-brandRed text-white">Cancelar</button>
    </div>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  function submit(e) {
    e.preventDefault()
    if (email.endsWith('@ifce.edu.br')) {
      onLogin({ id: String(Math.floor(Math.random() * 9000) + 1000), email })
    } else {
      alert('(dani@ifce.edu.br) para logar (#mock).')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white/60 p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-brandGreen font-bold">IFCE - CRATO</div>
          <div className="text-4xl text-brandRed font-extrabold mt-2">S.A.R.E</div>
        </div>
        <label className="block text-sm font-medium text-brandRed">Login:</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@ifce.edu.br" className="w-full p-3 rounded-full border-2 border-brandGreen mb-4" />
        <label className="block text-sm font-medium text-brandRed">Senha:</label>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="********" className="w-full p-3 rounded-full border-2 border-brandGreen mb-4" />
        <button type="submit" className="w-full py-3 rounded-full bg-brandGreen text-white">Entrar</button>
      </form>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [meals, setMeals] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:4000/meals')
        if (res.ok) {
          const data = await res.json()
          setMeals(data)
          return
        }
      } catch (e) {}
      setMeals([
        { id: 1, title: 'JANTAR', body: 'Arroz, Feijão, Macarrão, Frango e Salada\nSuco: Laranja', reserved: false },
        { id: 2, title: 'LANCHE', body: 'Pão com Ovo\nSuco: Goiaba', reserved: false }
      ])
    }
    load()
  }, [])

  async function reserve(meal) {
    if (!user) return alert('Faça login antes de reservar.')
    setSelectedMeal(meal)
    setShowConfirm(true)
  }

  async function confirmReserve() {
    try {
      await fetch('http://localhost:4000/reservations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, mealId: selectedMeal.id, date: new Date().toISOString() })
      })
    } catch (e) {}
    setMeals(prev => prev.map(m => m.id === selectedMeal.id ? { ...m, reserved: true } : m))
    setShowConfirm(false)
    setSelectedMeal(null)
  }

  function cancelReserve() {
    setShowConfirm(false)
    setSelectedMeal(null)
  }

  if (!user) return <Login onLogin={setUser} />

  return (
    <div className="min-h-screen p-4">
      <Header user={user} onMenu={() => alert('Menu (mock)')} />
      <main className="space-y-8 mt-2">
        <div className="text-center text-brandGreen font-medium">Cardápio do Dia {new Date().toLocaleDateString()}</div>
        <section className="flex flex-col gap-8 items-center">
          {meals.map(meal => (
            <MealCard key={meal.id} title={meal.title} body={meal.body} reserved={!!meal.reserved} onReserve={() => reserve(meal)} />
          ))}
          <ConfirmButtons onConfirm={confirmReserve} onCancel={() => alert('Operação cancelada (mock)')} />
        </section>
      </main>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-11/12 max-w-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Deseja agendar a refeição ?</h3>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setShowConfirm(false); setSelectedMeal(null) }} className="px-6 py-2 rounded-full bg-brandRed text-white">Não</button>
              <button onClick={confirmReserve} className="px-6 py-2 rounded-full bg-brandGreen text-white">Sim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
