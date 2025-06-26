import { useCallback, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';

import maketImage from '@assets/maket.jpg';
import { CONFIG } from '@constants/media';
import { cn, getImage } from '@helpers';

type TypeImage = {
	alias: string;
	aliasIndex: number;
	number: number;
	count: number;
	data: string;
	price: string;
};

const App = () => {
	const ref = useRef(null);

	const [testImage, setTestImage] = useState(false);
	const [imageStyle, setImageStyle] = useState(true);
	const [image, setImage] = useState<TypeImage>({
		alias: CONFIG[0].alias,
		aliasIndex: 0,
		count: CONFIG[0].count,
		number: 1,
		data: CONFIG[0].items[0].split(',')[0],
		price: CONFIG[0].items[0].split(',')[1],
	});

	const handleCapture = useCallback(() => {
		if (!ref.current) return alert(`error: "ref.current" not found`);

		toJpeg(ref.current, { cacheBust: true })
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = `${image.number}.jpg`;
				link.href = dataUrl;
				link.click();
			})
			.catch((e) => {
				alert('error: see console');
				console.log('ERROR:');
				console.log(e);
			});
	}, [ref, image.number]);

	const handleBack = () => {
		if (!image) return;

		if (image.aliasIndex === 0 && image.number === 1) return alert('images are out!');

		if (image.number > 1) {
			return setImage((prev) => ({
				...prev,
				number: prev.number - 1,
				data: CONFIG[prev.aliasIndex].items[prev.number - 2].split(',')[0],
				price: CONFIG[prev.aliasIndex].items[prev.number - 2].split(',')[1],
			}));
		}

		if (image.number === 1) {
			return setImage((prev) => ({
				aliasIndex: prev.aliasIndex - 1,
				alias: CONFIG[prev.aliasIndex - 1].alias,
				count: CONFIG[prev.aliasIndex - 1].count,
				number: CONFIG[prev.aliasIndex - 1].count,
				data: CONFIG[prev.aliasIndex - 1].items[CONFIG[prev.aliasIndex - 1].count - 1].split(
					',',
				)[0],
				price: CONFIG[prev.aliasIndex - 1].items[CONFIG[prev.aliasIndex - 1].count - 1].split(
					',',
				)[1],
			}));
		}
	};

	const handleNext = () => {
		if (!image) return;

		if (image.number < image.count) {
			return setImage((prev) => ({
				...prev,
				number: prev.number + 1,
				data: CONFIG[image.aliasIndex].items[prev.number].split(',')[0],
				price: CONFIG[image.aliasIndex].items[prev.number].split(',')[1],
			}));
		}

		if (image.number >= image.count) {
			const newAliasIndex = image.aliasIndex + 1;
			if (newAliasIndex === CONFIG.length) return alert('images are out!');

			return setImage(() => ({
				alias: CONFIG[newAliasIndex].alias,
				aliasIndex: newAliasIndex,
				count: CONFIG[newAliasIndex].count,
				number: 1,
				data: CONFIG[newAliasIndex].items[0].split(',')[0],
				price: CONFIG[newAliasIndex].items[0].split(',')[1],
			}));
		}
	};

	const handleCopyAlias = async () => {
		try {
			await navigator.clipboard.writeText(image.alias);
		} catch (e) {
			alert('error copy: see console');
			console.log('ERROR:');
			console.log(e);
		}
	};

	return (
		<div className="h-[100svh] w-[100svw] flex items-center justify-center bg-emerald-50 flex-col gap-y-6">
			{/* Title */}
			<div className="flex flex-row gap-x-6 items-center">
				<div className="flex flex-row gap-x-3 items-center">
					<span>
						alias: <span className="font-semibold">"{image.alias}"</span>
					</span>
					<span className="font-semibold">
						{image.aliasIndex + 1} / {CONFIG.length}
					</span>
				</div>

				<span>|</span>

				<div className="flex flex-row gap-x-3 items-center">
					<span>image:</span>
					<span className="font-semibold">
						{image.number} / {image.count}
					</span>
				</div>
			</div>

			{/* Capture element */}
			<div
				ref={ref}
				className={cn(
					`min-w-[1180px] max-w-[1180px]`,
					`min-h-[853px] max-h-[853px]`,
					'flex items-center justify-center bg-white relative',
				)}
			>
				{/* Image */}
				{image ? (
					<img
						className={cn(imageStyle ? 'object-cover h-full' : '')}
						src={getImage(image.alias, image.number)}
						alt="Dynamic Import"
					/>
				) : (
					<p>Loading image...</p>
				)}

				{/* Text */}
				<div
					className="text-wrap flex flex-row absolute pr-6 pl-6.5
				 pt-2 pb-3.5 left-[720px] top-[728px] gap-x-4"
				>
					<div className="flex flex-col max-w-[144px] gap-y-2">
						<span className="text-white text-[25px] font-semibold leading-5">
							дата проекта
						</span>
						<span className="text-white text-[25px] font-semibold leading-5">
							стоимость проекта
						</span>
					</div>

					<div className="flex flex-col justify-between pt-3.5 pb-2.5">
						<span className="text-black text-[37px] font-semibold leading-5">
							{image.data}
						</span>
						<span className="text-black text-[37px] font-semibold leading-5">
							{image.price}
						</span>
					</div>
				</div>

				{/* Macket Image */}
				{testImage ? (
					<img src={maketImage} className="absolute object-cover h-full opacity-80" />
				) : null}
			</div>

			{/* Buttons */}
			<div className="flex flex-row items-center justify-center gap-x-3 max-w-[1180px]">
				<button onClick={() => setImageStyle((prev) => !prev)}>
					image style: {imageStyle ? ' ✅' : ' 🚫'}
				</button>

				<button onClick={() => setTestImage((prev) => !prev)}>
					macket image: {testImage ? ' ✅' : ' 🚫'}
				</button>

				<button onClick={handleCopyAlias}>copy alias 📂</button>

				<button onClick={handleBack}>⬅️ back</button>
				<button onClick={handleNext}>next ➡️</button>

				<button onClick={handleCapture}>download 🔰</button>
			</div>
		</div>
	);
};

export default App;
