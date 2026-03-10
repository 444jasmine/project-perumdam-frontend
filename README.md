# Frontend PDAM Survey

Frontend ini disiapkan untuk menghubungkan UI ke backend di folder `survey-backend`.

## Menjalankan

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan mode development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Konfigurasi API

1. Copy `.env.example` menjadi `.env`
2. Atur nilai:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Di halaman, kamu tetap bisa override Base URL API manual dari input **Base URL API**.

## Endpoint yang sudah terhubung

- `POST /api/auth/login`
- `GET /api/items`
- `POST /api/surveys`
- `GET /api/results`
- `POST /api/uploads/upload`
- `GET /api/results/:id/receipt.pdf`

## Catatan integrasi ke UI/UX kamu

Jika kamu sudah punya layout UI/UX sendiri, pakai file berikut sebagai layer integrasi API:

- `frontend/src/config.js`
- `frontend/src/api.js`
- `frontend/src/app.js`

Tinggal mapping event dari komponen UI kamu ke fungsi API yang sudah tersedia.

## Mapping event UI ke API

Berikut mapping yang dipakai di implementasi default (`frontend/src/app.js`):

| Komponen UI (ID) | Event | Fungsi API (`frontend/src/api.js`) | Endpoint Backend |
|---|---|---|---|
| `#loginForm` | `submit` | `login(username, password)` | `POST /api/auth/login` |
| `#loadItemsBtn` | `click` | `getItems()` | `GET /api/items` |
| `#surveyForm` | `submit` | `createSurvey(payload)` | `POST /api/surveys` |
| `#loadResultsBtn` | `click` | `getSurveyResults()` | `GET /api/results` |
| `#uploadForm` | `submit` | `uploadDocument(file)` | `POST /api/uploads/upload` |
| Link Receipt di tabel hasil | `click` | `getReceiptUrl(surveyId)` | `GET /api/results/:id/receipt.pdf` |

### Detail payload yang dikirim

1. Login (`POST /api/auth/login`)

`login()` mengirim `FormData`:

- `username`
- `password`

2. Simpan survey (`POST /api/surveys`)

`createSurvey()` mengirim JSON:

```json
{
	"title": "Survey Pipa Area A",
	"description": "Catatan inspeksi",
	"items": ["itemId1", "itemId2"]
}
```

3. Upload dokumen (`POST /api/uploads/upload`)

`uploadDocument()` mengirim `FormData` dengan field file:

- `document`

### Cara pakai jika UI kamu custom

1. Pertahankan `frontend/src/api.js` sebagai service layer.
2. Di komponen UI kamu, panggil fungsi yang sama saat event terjadi (klik/submit).
3. Tampilkan hasil atau error dari `Promise` ke komponen (toast, alert, panel log, dsb).
4. Untuk PDF receipt, buat link dari `getReceiptUrl(id)` lalu buka di tab baru.

## Contoh implementasi (React)

Contoh berikut pakai pola event yang sama, hanya tampilan yang beda. Kamu bisa pecah jadi beberapa komponen sesuai kebutuhan.

```jsx
import { useState } from 'react';
import {
	login,
	getItems,
	createSurvey,
	getSurveyResults,
	uploadDocument,
	getReceiptUrl
} from './api';

export default function SurveyPage() {
	const [status, setStatus] = useState('Siap');
	const [loginResult, setLoginResult] = useState(null);
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [results, setResults] = useState([]);
	const [uploadResult, setUploadResult] = useState(null);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [file, setFile] = useState(null);

	async function onLoginSubmit(event) {
		event.preventDefault();
		try {
			const res = await login(username, password);
			setLoginResult(res);
			setStatus('Login berhasil');
		} catch (error) {
			setStatus(`Login gagal: ${error.message}`);
		}
	}

	async function onLoadItems() {
		try {
			const data = await getItems();
			setItems(Array.isArray(data) ? data : []);
			setStatus('Items berhasil dimuat');
		} catch (error) {
			setStatus(`Gagal memuat items: ${error.message}`);
		}
	}

	function onToggleItem(itemId, checked) {
		setSelectedItems((prev) => {
			if (checked) return [...prev, itemId];
			return prev.filter((id) => id !== itemId);
		});
	}

	async function onSurveySubmit(event) {
		event.preventDefault();
		const payload = {
			title,
			description,
			items: selectedItems
		};

		try {
			await createSurvey(payload);
			setStatus('Survey berhasil disimpan');
		} catch (error) {
			setStatus(`Gagal simpan survey: ${error.message}`);
		}
	}

	async function onLoadResults() {
		try {
			const data = await getSurveyResults();
			setResults(Array.isArray(data) ? data : []);
			setStatus('Results berhasil dimuat');
		} catch (error) {
			setStatus(`Gagal memuat results: ${error.message}`);
		}
	}

	async function onUploadSubmit(event) {
		event.preventDefault();
		if (!file) {
			setStatus('Pilih file dulu');
			return;
		}

		try {
			const res = await uploadDocument(file);
			setUploadResult(res);
			setStatus('Upload berhasil');
		} catch (error) {
			setStatus(`Upload gagal: ${error.message}`);
		}
	}

	return (
		<div>
			<h1>Survey Page</h1>
			<p>{status}</p>

			<form onSubmit={onLoginSubmit}>
				<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<button type="submit">Login</button>
			</form>

			<button type="button" onClick={onLoadItems}>Muat Items</button>
			<ul>
				{items.map((item) => {
					const itemId = item._id || item.id;
					return (
						<li key={itemId}>
							<label>
								<input
									type="checkbox"
									onChange={(e) => onToggleItem(itemId, e.target.checked)}
								/>
								{item.name} ({item.satuan})
							</label>
						</li>
					);
				})}
			</ul>

			<form onSubmit={onSurveySubmit}>
				<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul Survey" />
				<input
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Deskripsi"
				/>
				<button type="submit">Simpan Survey</button>
			</form>

			<button type="button" onClick={onLoadResults}>Muat Results</button>
			<ul>
				{results.map((result) => {
					const id = result._id || result.id;
					return (
						<li key={id}>
							{result.title}{' '}
							{id ? (
								<a href={getReceiptUrl(id)} target="_blank" rel="noreferrer">
									Receipt PDF
								</a>
							) : null}
						</li>
					);
				})}
			</ul>

			<form onSubmit={onUploadSubmit}>
				<input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				<button type="submit">Upload</button>
			</form>

			<pre>{JSON.stringify({ loginResult, uploadResult }, null, 2)}</pre>
		</div>
	);
}
```

### Ringkasan handler React

- `onLoginSubmit` -> `login(username, password)`
- `onLoadItems` -> `getItems()`
- `onSurveySubmit` -> `createSurvey({ title, description, items })`
- `onLoadResults` -> `getSurveyResults()`
- `onUploadSubmit` -> `uploadDocument(file)`
- Link PDF -> `getReceiptUrl(id)`
