import classNames from 'classnames';

export { classNames as cn };

export const getImage = (alias: string, n: number) => {
	return `/images/${alias}/sources/${n}.jpg`;
};
