import Link from "next/link";
import { useRouter } from "next/router";
import FailureIcon from "../../../public/images/failure.svg"
import Image from "next/image";

const PaymentFailure = () => {
    const router = useRouter();
    return (
        <div class="bg-white flex flex-col justify-center items-center h-screen">
            <div class=" p-6  md:mx-auto">
                <div class="text-center">
                    <img src={FailureIcon} alt="failure" width={80} height={80} />
                </div>

                <div class="text-center">
                    <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Failed to make payment.</h3>
                    <p>Please try again!</p>
                    <div class="py-10 text-center">
                        <div onClick={() => router.push('/')} class="px-12 btn cursor-pointer btn-primary text-white font-semibold py-3">
                            GO HOME
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailure;