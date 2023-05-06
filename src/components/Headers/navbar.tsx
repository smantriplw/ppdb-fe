import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
    return (
        <div className="navbar bg-[#104271] bg-opacity-70">
            <div className="navbar-start">
                <div className='flex gap-3 items-center'>
                    <Image src={'/logo.png'} alt={'Logo SMAN 3 Palu'} height={30} width={40} />
                    <a className="font-semibold normal-case text-xl text-white">
                        <p>
                            PPDB
                        </p>
                        <p>
                            SMAN 3 Palu
                        </p>
                    </a>
                </div>
            </div>
            {/* <div className="navbar-end">
                <Link className="btn" href={'/login'}>
                    login
                </Link>
            </div> */}
        </div>
    )
}