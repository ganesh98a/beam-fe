import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import {
    imageCropOpenPopup,
    setCroppedImage
} from "../../actions";
import { Cookies } from "react-cookie-consent";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class ImageCropperComponent extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            crop: {
                /* unit: "px", // default, can be 'px' or '%'
                x: 130,
                y: 50,
                width: 200,
                height: 200,
                aspect: 16 / 9
                 */
            },
            imageModalOpen: this.props.is_image_model
        }
        this.imageElement = React.createRef();

        this.closeModel = this.closeModel.bind(this);
        this.cancelCrop = this.cancelCrop.bind(this);
        this.saveCrop = this.saveCrop.bind(this);
        this.cropperInitiate = this.cropperInitiate.bind(this);

    }
    componentDidMount() {
        console.log('viji-Componentdidmount', this.imageElement)
        var cropProps = this.props.crop;
        // this.setState({ crop: cropProps, src: null });
        //this.cropperInitiate();
    }
    componentWillReceiveProps() {
        //this.cropperInitiate()
    }
    _setCropBoxData() {
        console.log('_setcripboxdata')
        var w = this.props.width;
        var h = this.props.height;
        this.refs.cropper.setCropBoxData({ width: w, height: h });
    }
    _crop() {
        // image in dataUrl
        console.log('_crop', this.refs.cropper.getCroppedCanvas());
        const canvas = this.refs.cropper.getCroppedCanvas();
        canvas.toBlob(blob => {
            if (!blob) {
                //reject(new Error('Canvas is empty'));
                console.error("Canvas is empty");
                return;
            }
            //blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            this.setState({ blobFile: blob }) // Set blob image inside the state here 
            //  resolve(this.fileUrl);
        }, "image/jpeg");

        this.setState({ croppedImageUrl: canvas.toDataURL("image/png") });
    }
    onCropperInit(cropper) {
        console.log('onCropperInit', cropper);
        this.cropper = cropper;
    }
    cropperInitiate() {
        console.log('viji-cropperInitiate', this.props)

        const cropper = new Cropper(this.imageElement.current, {
            scalable: false,
            cropBoxResizable: false,
            aspectRatio: this.props.aspectRatio,
            background: false,
            width: 800,
            height: 485,
            crop: () => {
                const canvas = cropper.getCroppedCanvas();
                canvas.toBlob(blob => {
                    if (!blob) {
                        //reject(new Error('Canvas is empty'));
                        console.error("Canvas is empty");
                        return;
                    }
                    //blob.name = fileName;
                    window.URL.revokeObjectURL(this.fileUrl);
                    this.fileUrl = window.URL.createObjectURL(blob);
                    this.setState({ blobFile: blob }) // Set blob image inside the state here 
                    //  resolve(this.fileUrl);
                }, "image/jpeg");

                this.setState({ imageDestination: canvas.toDataURL("image/png"), croppedImageUrl: canvas.toDataURL("image/png") });
            }
        });
    }
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                this.setState({ blobFile: blob }) // Set blob image inside the state here 
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }
    closeModel() { //for close the login model
        this.props.imageCropOpenPopup(false);
        const min = 1;
        const max = 100;
        const rand = min + Math.random() * (max - min);
        var data = { croppedImageUrl: '', blobFile: rand };
        this.props.setCroppedImage(data);
    }
    cancelCrop() {
        this.setState({ src: null })
        this.props.imageCropOpenPopup(false);
        this.closeModel();
    }
    saveCrop() {
        const { croppedImageUrl, blobFile } = this.state;
        var data = { croppedImageUrl, blobFile };
        this.props.setCroppedImage(data);
        this.props.imageCropOpenPopup(false);
        //this.closeModel();
    }
    render() {
        const { src, croppedImageUrl, crop } = this.state;
        const { is_image_crop_open } = this.props;
        console.log('this.props.src', this.props)
        return (
            <div>
                <Modal
                    classNames={{
                        overlay: 'customOverlay',
                        modal: 'customModal',
                    }}
                    open={is_image_crop_open}
                    onClose={() => { }}
                    center
                >
                    <div className={(Cookies.get('closeBanner') == 'false' && !this.props.close_banner) ? "modal-dialog modal-width--custom cms-model m-t-80" : "modal-dialog modal-width--custom cms-model m-t-80"} role="document">
                        <div className="modal-content">
                            <div className="modal-header header-styling">
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true" onClick={this.closeModel}>
                                        &times;</span>
                                </button>
                            </div>
                            <div className="modal-body body-padding--value">
                                <div>
                                    {//src && (
                                        /*  <div>
                                             <img ref={this.imageElement} src={this.props.src} alt="Source" crossorigin />
 
                                         </div> */
                                        //)
                                    }
                                    <Cropper
                                        ref='cropper'
                                        src={this.props.src}
                                        autoCropArea={0}
                                        //style={{ height: '100%', width: '100%' }}
                                        style={{ height: '500px' }}
                                        aspectRatio={this.props.aspectRatio ? this.props.aspectRatio : 'NAN'}
                                        guides={false}
                                        crop={this._crop.bind(this)}
                                        //scalable={false}
                                        //cropBoxResizable={false}
                                        minCropBoxWidth={400}
                                        minCropBoxHeight={100}
                                        minContainerWidth={this.props.width}
                                        minContainerHeight={this.props.height}
                                        ready={this._setCropBoxData.bind(this)}
                                        dragMode={'none'}
                                        viewMode={1}
                                    />

                                </div>
                                <div className="col-12 col-md-12 col-lg-12 text-center p-0 m-b-15 float-right">
                                    <div className="row">
                                        <div className="col-md-12 text-right mt-3">
                                            <button
                                                onClick={this.cancelCrop}
                                                className=" btn btn-red tx-tfm font-book font-14 mr-3"
                                            >Cancel </button>
                                            <button
                                                className=" btn btn-login tx-tfm font-book font-14"
                                                onClick={this.saveCrop}
                                            >Crop and Save </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        is_auth: state.auth.is_auth,
        is_image_crop_open: state.workout.is_image_crop_open,

    };
};

const mapDispatchToProps = {
    imageCropOpenPopup,
    setCroppedImage
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageCropperComponent);